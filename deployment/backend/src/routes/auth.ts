import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from '../config/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { isValidGst, isValidPan, isValidPhone } from '../services/compliance.js';

const router = Router();

function toClientRole(role?: string) {
  return (role || 'buyer').toUpperCase();
}

function splitName(name?: string) {
  if (!name) return { firstName: undefined, lastName: undefined };
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ') || undefined,
  };
}

async function buildClientUser(connection: any, user: any) {
  const [companies] = await connection.query('SELECT id FROM companies WHERE userId = ? ORDER BY createdAt ASC LIMIT 1', [user.id]);
  const companyId = (companies as any[])[0]?.id ?? null;
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;

  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    firstName: user.firstName,
    lastName: user.lastName,
    role: toClientRole(user.role),
    name,
    companyId,
  };
}

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      name,
      phone,
      companyName,
      companyId,
      gstNumber,
      panNumber,
      industry,
      companyDomain,
      website,
      address,
      description,
    } = req.body;

    if (!email || !password || !name || !companyName || !gstNumber || !phone) {
      return res.status(400).json({ error: 'name, companyName, gstNumber, email, phone, and password are required' });
    }

    const normalizedGst = String(gstNumber).trim().toUpperCase();
    const normalizedPhone = String(phone).trim();
    if (!isValidGst(normalizedGst)) {
      return res.status(400).json({
        error: 'Invalid GST format. Expected 15 characters like 27ABCDE1234F1Z5',
      });
    }
    if (!isValidPhone(normalizedPhone)) {
      return res.status(400).json({
        error: 'Invalid phone format. Use 8-15 digits, optional leading + (example: +919876543210)',
      });
    }
    const normalizedPan = panNumber ? String(panNumber).trim().toUpperCase() : null;
    if (normalizedPan && !isValidPan(normalizedPan)) {
      return res.status(400).json({
        error: 'Invalid PAN format. Expected 10 characters like ABCDE1234F',
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const resolvedName = splitName(name);
    const resolvedFirstName = firstName ?? resolvedName.firstName;
    const resolvedLastName = lastName ?? resolvedName.lastName;

    const connection = await pool.getConnection();

    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
    if ((users as any[]).length > 0) {
      connection.release();
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await connection.query(
      'INSERT INTO users (id, email, password, phone, firstName, lastName, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, normalizedEmail, hashedPassword, normalizedPhone, resolvedFirstName ?? null, resolvedLastName ?? null, (role || 'seller').toLowerCase()]
    );

    let createdCompanyId = companyId ?? null;
    if (companyName) {
      createdCompanyId = companyId || uuidv4();
      await connection.query(
        'INSERT INTO companies (id, name, email, gst, pan, phone, address, website, domain, industry, description, userId, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          createdCompanyId,
          companyName,
          normalizedEmail,
          normalizedGst,
          normalizedPan,
          normalizedPhone,
          address ?? null,
          website ?? null,
          companyDomain ?? null,
          industry ?? null,
          description ?? 'Merchant onboarding profile',
          userId,
          false,
        ]
      );
    }

    const [createdUsers] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
    const createdUser = (createdUsers as any[])[0];

    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
    const token = jwt.sign(
      { userId: userId, companyId: createdCompanyId },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRY || '7d' } as SignOptions
    );

    const clientUser = await buildClientUser(connection, createdUser);

    connection.release();
    res.status(201).json({ token, user: clientUser });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);

    if ((users as any[]).length === 0) {
      connection.release();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = (users as any)[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      connection.release();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const clientUser = await buildClientUser(connection, user);

    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
    const token = jwt.sign(
      { userId: user.id, companyId: clientUser.companyId },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRY || '7d' } as SignOptions
    );

    connection.release();

    res.json({ token, user: clientUser });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
router.post('/logout', authMiddleware, (_req: AuthRequest, res: Response) => {
  res.json({ success: true });
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT id, email, phone, firstName, lastName, role FROM users WHERE id = ?', [req.userId]);

    if ((users as any[]).length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    const user = await buildClientUser(connection, (users as any)[0]);
    connection.release();
    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, name } = req.body;
    const parsed = splitName(name);
    const nextFirstName = firstName ?? parsed.firstName ?? null;
    const nextLastName = lastName ?? parsed.lastName ?? null;

    const connection = await pool.getConnection();

    await connection.query('UPDATE users SET firstName = COALESCE(?, firstName), lastName = COALESCE(?, lastName) WHERE id = ?', [
      nextFirstName,
      nextLastName,
      req.userId,
    ]);

    const [users] = await connection.query('SELECT id, email, phone, firstName, lastName, role FROM users WHERE id = ?', [req.userId]);
    const user = await buildClientUser(connection, (users as any[])[0]);

    connection.release();
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.post('/change-password', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, oldPassword, newPassword } = req.body;
    const existingPassword = currentPassword ?? oldPassword;

    if (!existingPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword/oldPassword and newPassword are required' });
    }

    const connection = await pool.getConnection();

    const [users] = await connection.query('SELECT password FROM users WHERE id = ?', [req.userId]);

    if ((users as any[]).length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(existingPassword, (users as any)[0].password);

    if (!isValid) {
      connection.release();
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.userId]);

    connection.release();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Validate token
router.post('/validate-token', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ valid: true, userId: req.userId });
});

export default router;
