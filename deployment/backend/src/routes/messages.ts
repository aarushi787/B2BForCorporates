import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

function mapMessage(row: any) {
  return {
    id: row.id,
    senderId: row.senderId,
    receiverId: row.receiverId,
    dealId: row.dealId ?? undefined,
    content: row.content,
    timestamp: row.createdAt,
    type: 'text',
  };
}

// Get all messages
router.get('/', async (_req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM messages ORDER BY createdAt DESC');
    connection.release();
    res.json((rows as any[]).map(mapMessage));
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get messages by company
router.get('/company/:companyId', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM messages WHERE senderId = ? OR receiverId = ? ORDER BY createdAt DESC',
      [req.params.companyId, req.params.companyId]
    );
    connection.release();
    res.json((rows as any[]).map(mapMessage));
  } catch (error) {
    console.error('Get company messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get message thread between two users
router.get('/thread', async (req: Request, res: Response) => {
  try {
    const { sender, receiver } = req.query;

    if (!sender || !receiver) {
      return res.status(400).json({ error: 'Sender and receiver IDs are required' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      '(SELECT * FROM messages WHERE senderId = ? AND receiverId = ?) UNION (SELECT * FROM messages WHERE senderId = ? AND receiverId = ?) ORDER BY createdAt DESC',
      [sender, receiver, receiver, sender]
    );
    connection.release();
    res.json((rows as any[]).map(mapMessage));
  } catch (error) {
    console.error('Get message thread error:', error);
    res.status(500).json({ error: 'Failed to fetch message thread' });
  }
});

// Get deal messages
router.get('/deal/:dealId', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM messages WHERE dealId = ? ORDER BY createdAt DESC', [req.params.dealId]);
    connection.release();
    res.json((rows as any[]).map(mapMessage));
  } catch (error) {
    console.error('Get deal messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/send', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { senderId, receiverId, dealId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ error: 'Sender ID, receiver ID, and content are required' });
    }

    const connection = await pool.getConnection();
    const messageId = uuidv4();

    await connection.query(
      'INSERT INTO messages (id, senderId, receiverId, dealId, content) VALUES (?, ?, ?, ?, ?)',
      [messageId, senderId, receiverId, dealId ?? null, content]
    );

    const [rows] = await connection.query('SELECT * FROM messages WHERE id = ?', [messageId]);
    connection.release();
    res.status(201).json(mapMessage((rows as any[])[0]));
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark message as read
router.put('/:id/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('UPDATE messages SET isRead = TRUE WHERE id = ?', [req.params.id]);
    const [rows] = await connection.query('SELECT * FROM messages WHERE id = ?', [req.params.id]);
    connection.release();

    if ((rows as any[]).length === 0) return res.status(404).json({ error: 'Message not found' });
    res.json(mapMessage((rows as any[])[0]));
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// Delete message
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
