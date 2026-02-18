import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

async function seed() {
  const connection = await pool.getConnection();
  try {
    console.log('Starting DB seed...');

    // Only 2 demo users as requested: admin + merchant
    const users = [
      { email: 'admin@example.com', password: 'password123', phone: '+919800000001', firstName: 'System', lastName: 'Admin', role: 'admin' },
      { email: 'merchant@example.com', password: 'password123', phone: '+919800000002', firstName: 'Maya', lastName: 'Merchant', role: 'seller' },
    ];

    for (const u of users) {
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await connection.query(
        `INSERT INTO users (id, email, password, phone, firstName, lastName, role)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           password = VALUES(password),
           phone = VALUES(phone),
           firstName = VALUES(firstName),
           lastName = VALUES(lastName),
           role = VALUES(role)`,
        [id, u.email, hashedPassword, u.phone, u.firstName, u.lastName, u.role]
      );
    }

    // Merchant company
    const [merchantRows] = await connection.query('SELECT id FROM users WHERE email = ?', ['merchant@example.com']);
    const merchantUserId = (merchantRows as any[])[0]?.id || null;

    await connection.query(
      `INSERT IGNORE INTO companies
       (id, name, email, gst, phone, address, website, domain, industry, description, userId, verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        'Demo Merchant Pvt Ltd',
        'merchant@demo.com',
        '27ABCDE1234F1Z5',
        '+919800000002',
        'Bangalore, Karnataka, India',
        'https://merchant.demo',
        'merchant.demo',
        'Manufacturing',
        'Demo merchant account for testing all seller/merchant/buyer flows.',
        merchantUserId,
        true,
      ]
    );

    // Merchant product
    const [companyRows] = await connection.query('SELECT id FROM companies WHERE email = ?', ['merchant@demo.com']);
    const merchantCompanyId = (companyRows as any[])[0]?.id;
    if (merchantCompanyId) {
      await connection.query(
        `INSERT IGNORE INTO products (id, name, description, price, category, inventory, merchantId)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), 'Demo Industrial Service Package', 'Demo offering for marketplace test flows.', 5000, 'Manufacturing', 999, merchantCompanyId]
      );
    }

    console.log('Seed completed');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    connection.release();
    process.exit(0);
  }
}

seed();
