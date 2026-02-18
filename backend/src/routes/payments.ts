import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { createAuditLog } from '../utils/audit.js';
import { runAmlCheck } from '../services/compliance.js';

const router = Router();

router.post('/escrows', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { dealId, payerCompanyId, payeeCompanyId, amount, currency, paymentProvider } = req.body;
    if (!dealId || !payerCompanyId || !payeeCompanyId || !amount) {
      return res.status(400).json({ error: 'dealId, payerCompanyId, payeeCompanyId and amount are required' });
    }

    const escrowId = uuidv4();
    const providerReference = `escrow_${Date.now()}`;
    const connection = await pool.getConnection();
    await connection.query(
      `INSERT INTO escrows (id, dealId, payerCompanyId, payeeCompanyId, amount, currency, status, paymentProvider, providerReference)
       VALUES (?, ?, ?, ?, ?, ?, 'CREATED', ?, ?)`,
      [escrowId, dealId, payerCompanyId, payeeCompanyId, amount, currency || 'USD', paymentProvider || 'manual', providerReference]
    );
    connection.release();

    await createAuditLog({
      userId: req.userId,
      companyId: req.companyId,
      action: 'ESCROW_CREATED',
      resourceType: 'escrow',
      resourceId: escrowId,
      metadata: { dealId, amount, currency: currency || 'USD' },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json({ id: escrowId, dealId, status: 'CREATED', providerReference });
  } catch (error) {
    console.error('Create escrow error:', error);
    res.status(500).json({ error: 'Failed to create escrow' });
  }
});

router.post('/escrows/:id/fund', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM escrows WHERE id = ?', [req.params.id]);
    const escrow = (rows as any[])[0];
    if (!escrow) {
      connection.release();
      return res.status(404).json({ error: 'Escrow not found' });
    }

    const aml = await runAmlCheck({
      dealId: escrow.dealId,
      escrowId: escrow.id,
      companyId: escrow.payerCompanyId,
      amount: Number(escrow.amount),
      currency: escrow.currency,
      metadata: { operation: 'escrow_fund' },
    });
    if (aml.decision === 'BLOCK') {
      connection.release();
      return res.status(403).json({
        error: 'Transaction blocked by AML policy',
        aml,
      });
    }

    await connection.query('UPDATE escrows SET status = "FUNDED" WHERE id = ?', [req.params.id]);
    await connection.query(
      `INSERT INTO payments (id, escrowId, dealId, companyId, amount, currency, direction, status, provider, providerReference, metadata)
       VALUES (?, ?, ?, ?, ?, ?, 'OUT', 'SUCCEEDED', ?, ?, ?)`,
      [
        uuidv4(),
        escrow.id,
        escrow.dealId,
        escrow.payerCompanyId,
        escrow.amount,
        escrow.currency,
        escrow.paymentProvider || 'manual',
        `fund_${Date.now()}`,
        JSON.stringify({ operation: 'escrow_fund' }),
      ]
    );
    connection.release();

    await createAuditLog({
      userId: req.userId,
      companyId: escrow.payerCompanyId,
      action: 'ESCROW_FUNDED',
      resourceType: 'escrow',
      resourceId: escrow.id,
      metadata: { amount: escrow.amount, currency: escrow.currency },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({ id: req.params.id, status: 'FUNDED' });
  } catch (error) {
    console.error('Fund escrow error:', error);
    res.status(500).json({ error: 'Failed to fund escrow' });
  }
});

router.post('/escrows/:id/release', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM escrows WHERE id = ?', [req.params.id]);
    const escrow = (rows as any[])[0];
    if (!escrow) {
      connection.release();
      return res.status(404).json({ error: 'Escrow not found' });
    }

    const aml = await runAmlCheck({
      dealId: escrow.dealId,
      escrowId: escrow.id,
      companyId: escrow.payeeCompanyId,
      amount: Number(escrow.amount),
      currency: escrow.currency,
      metadata: { operation: 'escrow_release' },
    });
    if (aml.decision === 'BLOCK') {
      connection.release();
      return res.status(403).json({
        error: 'Transaction blocked by AML policy',
        aml,
      });
    }

    await connection.query('UPDATE escrows SET status = "RELEASED" WHERE id = ?', [req.params.id]);
    await connection.query(
      `INSERT INTO payments (id, escrowId, dealId, companyId, amount, currency, direction, status, provider, providerReference, metadata)
       VALUES (?, ?, ?, ?, ?, ?, 'IN', 'SUCCEEDED', ?, ?, ?)`,
      [
        uuidv4(),
        escrow.id,
        escrow.dealId,
        escrow.payeeCompanyId,
        escrow.amount,
        escrow.currency,
        escrow.paymentProvider || 'manual',
        `release_${Date.now()}`,
        JSON.stringify({ operation: 'escrow_release' }),
      ]
    );
    connection.release();

    await createAuditLog({
      userId: req.userId,
      companyId: escrow.payeeCompanyId,
      action: 'ESCROW_RELEASED',
      resourceType: 'escrow',
      resourceId: escrow.id,
      metadata: { amount: escrow.amount, currency: escrow.currency },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({ id: req.params.id, status: 'RELEASED' });
  } catch (error) {
    console.error('Release escrow error:', error);
    res.status(500).json({ error: 'Failed to release escrow' });
  }
});

router.get('/escrows', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM escrows ORDER BY createdAt DESC');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('List escrows error:', error);
    res.status(500).json({ error: 'Failed to fetch escrows' });
  }
});

router.get('/transactions', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM payments ORDER BY createdAt DESC');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('List payments error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;
