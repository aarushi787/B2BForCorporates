import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { isValidGst, isValidPan, isValidPhone } from '../services/compliance.js';

const router = Router();

// Get all companies
router.get('/', async (_req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [companies] = await connection.query('SELECT * FROM companies');
    connection.release();
    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Search companies (must be before /:id)
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q = '' } = req.query as { q?: string };
    const connection = await pool.getConnection();
    const [companies] = await connection.query(
      'SELECT * FROM companies WHERE name LIKE ? OR email LIKE ? OR domain LIKE ?',
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );
    connection.release();
    res.json(companies);
  } catch (error) {
    console.error('Search companies error:', error);
    res.status(500).json({ error: 'Failed to search companies' });
  }
});

// Get companies by domain (must be before /:id)
router.get('/domain/:domain', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [companies] = await connection.query('SELECT * FROM companies WHERE domain = ?', [req.params.domain]);
    connection.release();
    res.json(companies);
  } catch (error) {
    console.error('Get companies by domain error:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get company by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [companies] = await connection.query('SELECT * FROM companies WHERE id = ?', [req.params.id]);
    connection.release();

    if ((companies as any[]).length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json((companies as any)[0]);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Create company
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, gst, pan, phone, address, website, domain, industry, description } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    if (gst && !isValidGst(String(gst))) {
      return res.status(400).json({
        error: 'Invalid GST format. Expected 15 characters like 27ABCDE1234F1Z5',
      });
    }
    if (pan && !isValidPan(String(pan))) {
      return res.status(400).json({
        error: 'Invalid PAN format. Expected 10 characters like ABCDE1234F',
      });
    }
    if (phone && !isValidPhone(String(phone))) {
      return res.status(400).json({
        error: 'Invalid phone format. Use 8-15 digits, optional leading + (example: +919876543210)',
      });
    }

    const connection = await pool.getConnection();
    const companyId = uuidv4();

    await connection.query(
      'INSERT INTO companies (id, name, email, gst, pan, phone, address, website, domain, industry, description, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [companyId, name, email, gst ? String(gst).trim().toUpperCase() : null, pan ? String(pan).trim().toUpperCase() : null, phone ? String(phone).trim() : null, address ?? null, website ?? null, domain ?? null, industry ?? null, description ?? null, req.userId ?? null]
    );

    const [rows] = await connection.query('SELECT * FROM companies WHERE id = ?', [companyId]);
    connection.release();
    res.status(201).json((rows as any[])[0]);
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Update company
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, gst, pan, phone, address, website, domain, industry, description } = req.body;
    if (gst && !isValidGst(String(gst))) {
      return res.status(400).json({
        error: 'Invalid GST format. Expected 15 characters like 27ABCDE1234F1Z5',
      });
    }
    if (pan && !isValidPan(String(pan))) {
      return res.status(400).json({
        error: 'Invalid PAN format. Expected 10 characters like ABCDE1234F',
      });
    }
    if (phone && !isValidPhone(String(phone))) {
      return res.status(400).json({
        error: 'Invalid phone format. Use 8-15 digits, optional leading + (example: +919876543210)',
      });
    }
    const connection = await pool.getConnection();

    await connection.query(
      `UPDATE companies
       SET name = COALESCE(?, name),
           email = COALESCE(?, email),
           gst = COALESCE(?, gst),
           pan = COALESCE(?, pan),
           phone = COALESCE(?, phone),
           address = COALESCE(?, address),
           website = COALESCE(?, website),
           domain = COALESCE(?, domain),
           industry = COALESCE(?, industry),
           description = COALESCE(?, description)
       WHERE id = ?`,
      [name ?? null, email ?? null, gst ? String(gst).trim().toUpperCase() : null, pan ? String(pan).trim().toUpperCase() : null, phone ? String(phone).trim() : null, address ?? null, website ?? null, domain ?? null, industry ?? null, description ?? null, req.params.id]
    );

    const [rows] = await connection.query('SELECT * FROM companies WHERE id = ?', [req.params.id]);
    connection.release();

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// Delete company
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM companies WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

// Verify company
router.put('/:id/verify', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('UPDATE companies SET verified = TRUE WHERE id = ?', [req.params.id]);
    const [rows] = await connection.query('SELECT * FROM companies WHERE id = ?', [req.params.id]);
    connection.release();

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Verify company error:', error);
    res.status(500).json({ error: 'Failed to verify company' });
  }
});

export default router;
