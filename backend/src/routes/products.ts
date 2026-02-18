import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get all products
router.get('/', async (_req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [products] = await connection.query('SELECT * FROM products');
    connection.release();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get products by merchant (must be before /:id)
router.get('/merchant/:merchantId', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [products] = await connection.query('SELECT * FROM products WHERE merchantId = ?', [req.params.merchantId]);
    connection.release();
    res.json(products);
  } catch (error) {
    console.error('Get merchant products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Search products (must be before /:id)
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q = '' } = req.query as { q?: string };
    const connection = await pool.getConnection();
    const [products] = await connection.query(
      'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?',
      [`%${q}%`, `%${q}%`]
    );
    connection.release();
    res.json(products);
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

// Get products by category (must be before /:id)
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [products] = await connection.query('SELECT * FROM products WHERE category = ?', [req.params.category]);
    connection.release();
    res.json(products);
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [products] = await connection.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    connection.release();

    if ((products as any[]).length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json((products as any[])[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, category, inventory, merchantId } = req.body;

    if (!name || price === undefined || price === null) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    if (!merchantId) {
      return res.status(400).json({ error: 'merchantId is required' });
    }

    const connection = await pool.getConnection();
    const productId = uuidv4();

    await connection.query(
      'INSERT INTO products (id, name, description, price, category, inventory, merchantId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [productId, name, description ?? null, price, category ?? null, inventory ?? 0, merchantId]
    );

    const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [productId]);
    connection.release();
    res.status(201).json((rows as any[])[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, category, inventory } = req.body;
    const connection = await pool.getConnection();

    await connection.query(
      `UPDATE products
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           price = COALESCE(?, price),
           category = COALESCE(?, category),
           inventory = COALESCE(?, inventory)
       WHERE id = ?`,
      [name ?? null, description ?? null, price ?? null, category ?? null, inventory ?? null, req.params.id]
    );

    const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    connection.release();

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Update inventory
router.put('/:id/inventory', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { inventory } = req.body;

    if (inventory === undefined || inventory === null) {
      return res.status(400).json({ error: 'inventory is required' });
    }

    const connection = await pool.getConnection();
    await connection.query('UPDATE products SET inventory = ? WHERE id = ?', [inventory, req.params.id]);
    const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    connection.release();

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

export default router;
