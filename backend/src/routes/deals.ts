import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

function toFrontendStatus(status: string) {
  switch ((status || '').toLowerCase()) {
    case 'approved': return 'CONFIRMED';
    case 'completed': return 'COMPLETED';
    case 'rejected': return 'VOIDED';
    case 'cancelled': return 'VOIDED';
    case 'pending':
    default:
      return 'ENQUIRY';
  }
}

function toDbStatus(status?: string) {
  switch ((status || '').toUpperCase()) {
    case 'CONFIRMED': return 'approved';
    case 'COMPLETED': return 'completed';
    case 'VOIDED':
    case 'REJECTED': return 'rejected';
    case 'CANCELLED': return 'cancelled';
    case 'ENQUIRY':
    case 'NEGOTIATION':
    case 'IN_PRODUCTION':
    case 'SHIPPED':
    case 'DISPUTED':
    case 'FROZEN':
    default:
      return 'pending';
  }
}

function mapDealRow(row: any) {
  return {
    id: row.id,
    buyerId: row.buyerId,
    sellerIds: row.sellerId ? [row.sellerId] : [],
    productId: row.productId,
    status: toFrontendStatus(row.status),
    amount: Number(row.totalAmount || 0),
    platformFee: Number(row.totalAmount || 0) * 0.05,
    payoutAmount: Number(row.totalAmount || 0) * 0.95,
    revenueSplits: row.sellerId ? [{ companyId: row.sellerId, percentage: 100 }] : [],
    milestones: [],
    contracts: [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    notes: row.description || row.title || '',
    escrowStatus: 'UNFUNDED',
    riskScore: undefined,
    completionProbability: undefined,
  };
}

async function getDealById(id: string) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query('SELECT * FROM deals WHERE id = ?', [id]);
  connection.release();
  return (rows as any[])[0];
}

// Get all deals
router.get('/', async (_req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM deals ORDER BY createdAt DESC');
    connection.release();
    res.json((rows as any[]).map(mapDealRow));
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Get deals by buyer (must be before /:id)
router.get('/buyer/:buyerId', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM deals WHERE buyerId = ? ORDER BY createdAt DESC', [req.params.buyerId]);
    connection.release();
    res.json((rows as any[]).map(mapDealRow));
  } catch (error) {
    console.error('Get buyer deals error:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Get deals by seller (must be before /:id)
router.get('/seller/:sellerId', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM deals WHERE sellerId = ? ORDER BY createdAt DESC', [req.params.sellerId]);
    connection.release();
    res.json((rows as any[]).map(mapDealRow));
  } catch (error) {
    console.error('Get seller deals error:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Get deals by status (must be before /:id)
router.get('/status/:status', async (req: Request, res: Response) => {
  try {
    const dbStatus = toDbStatus(req.params.status);
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM deals WHERE status = ? ORDER BY createdAt DESC', [dbStatus]);
    connection.release();
    res.json((rows as any[]).map(mapDealRow));
  } catch (error) {
    console.error('Get deals by status error:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Get deal by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const row = await getDealById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Deal not found' });
    res.json(mapDealRow(row));
  } catch (error) {
    console.error('Get deal error:', error);
    res.status(500).json({ error: 'Failed to fetch deal' });
  }
});

// Create deal
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const sellerId = req.body.sellerId ?? req.body.sellerIds?.[0];
    const buyerId = req.body.buyerId;

    if (!buyerId || !sellerId) {
      return res.status(400).json({ error: 'buyerId and sellerId/sellerIds[0] are required' });
    }

    const title = req.body.title ?? req.body.notes ?? 'Deal';
    const description = req.body.description ?? req.body.notes ?? '';
    const quantity = req.body.quantity ?? 1;
    const totalAmount = req.body.totalAmount ?? req.body.amount ?? 0;
    const status = toDbStatus(req.body.status);

    const connection = await pool.getConnection();
    const dealId = uuidv4();

    await connection.query(
      'INSERT INTO deals (id, title, description, buyerId, sellerId, productId, quantity, totalAmount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [dealId, title, description, buyerId, sellerId, req.body.productId ?? null, quantity, totalAmount, status]
    );

    const [rows] = await connection.query('SELECT * FROM deals WHERE id = ?', [dealId]);
    connection.release();

    res.status(201).json(mapDealRow((rows as any[])[0]));
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

// Update deal
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM deals WHERE id = ?', [req.params.id]);
    const existing = (rows as any[])[0];

    if (!existing) {
      connection.release();
      return res.status(404).json({ error: 'Deal not found' });
    }

    const title = req.body.title ?? existing.title;
    const description = req.body.description ?? req.body.notes ?? existing.description;
    const quantity = req.body.quantity ?? existing.quantity;
    const totalAmount = req.body.totalAmount ?? req.body.amount ?? existing.totalAmount;
    const status = req.body.status ? toDbStatus(req.body.status) : existing.status;

    await connection.query(
      'UPDATE deals SET title = ?, description = ?, quantity = ?, totalAmount = ?, status = ? WHERE id = ?',
      [title, description, quantity, totalAmount, status, req.params.id]
    );

    const [updatedRows] = await connection.query('SELECT * FROM deals WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(mapDealRow((updatedRows as any[])[0]));
  } catch (error) {
    console.error('Update deal error:', error);
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

// Delete deal
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM deals WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Delete deal error:', error);
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

// Update deal status
router.put('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const status = toDbStatus(req.body.status);
    const connection = await pool.getConnection();
    await connection.query('UPDATE deals SET status = ? WHERE id = ?', [status, req.params.id]);
    const [rows] = await connection.query('SELECT * FROM deals WHERE id = ?', [req.params.id]);
    connection.release();

    if ((rows as any[]).length === 0) return res.status(404).json({ error: 'Deal not found' });
    res.json(mapDealRow((rows as any[])[0]));
  } catch (error) {
    console.error('Update deal status error:', error);
    res.status(500).json({ error: 'Failed to update deal status' });
  }
});

// Approve deal
router.put('/:id/approve', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('UPDATE deals SET status = ? WHERE id = ?', ['approved', req.params.id]);
    const [rows] = await connection.query('SELECT * FROM deals WHERE id = ?', [req.params.id]);
    connection.release();

    if ((rows as any[]).length === 0) return res.status(404).json({ error: 'Deal not found' });
    res.json(mapDealRow((rows as any[])[0]));
  } catch (error) {
    console.error('Approve deal error:', error);
    res.status(500).json({ error: 'Failed to approve deal' });
  }
});

// Reject deal
router.put('/:id/reject', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('UPDATE deals SET status = ? WHERE id = ?', ['rejected', req.params.id]);
    const [rows] = await connection.query('SELECT * FROM deals WHERE id = ?', [req.params.id]);
    connection.release();

    if ((rows as any[]).length === 0) return res.status(404).json({ error: 'Deal not found' });
    res.json(mapDealRow((rows as any[])[0]));
  } catch (error) {
    console.error('Reject deal error:', error);
    res.status(500).json({ error: 'Failed to reject deal' });
  }
});

export default router;
