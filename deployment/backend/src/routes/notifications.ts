import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

type SseClient = { id: string; userId?: string; companyId?: string; res: Response };
const sseClients = new Map<string, SseClient>();

function broadcastNotification(notification: any): void {
  const data = `data: ${JSON.stringify(notification)}\n\n`;
  for (const client of sseClients.values()) {
    const matchesUser = !client.userId || client.userId === notification.userId;
    const matchesCompany = !client.companyId || client.companyId === notification.companyId;
    if (matchesUser && matchesCompany) {
      client.res.write(data);
    }
  }
}

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT id, userId, companyId, type, title, message, payload, isRead, createdAt
       FROM notifications
       WHERE (userId = ? OR userId IS NULL) AND (companyId = ? OR companyId IS NULL)
       ORDER BY createdAt DESC
       LIMIT 100`,
      [req.userId ?? null, req.companyId ?? null]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('List notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.get('/stream', authMiddleware, (req: AuthRequest, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const id = uuidv4();
  sseClients.set(id, { id, userId: req.userId, companyId: req.companyId, res });
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', id })}\n\n`);

  req.on('close', () => {
    sseClients.delete(id);
  });
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const payload = req.body.payload ?? null;
    const notification = {
      id: uuidv4(),
      userId: req.body.userId ?? null,
      companyId: req.body.companyId ?? req.companyId ?? null,
      type: String(req.body.type ?? 'GENERAL'),
      title: String(req.body.title ?? 'Notification'),
      message: String(req.body.message ?? ''),
      payload: payload ? JSON.stringify(payload) : null,
      isRead: false,
    };

    const connection = await pool.getConnection();
    await connection.query(
      `INSERT INTO notifications (id, userId, companyId, type, title, message, payload, isRead)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        notification.id,
        notification.userId,
        notification.companyId,
        notification.type,
        notification.title,
        notification.message,
        notification.payload,
        notification.isRead,
      ]
    );
    connection.release();

    broadcastNotification({ ...notification, payload });
    res.status(201).json({ ...notification, payload });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

router.put('/:id/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('UPDATE notifications SET isRead = TRUE WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ id: req.params.id, isRead: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

export default router;

