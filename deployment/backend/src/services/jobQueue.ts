import pool from '../config/database.js';

type QueueJobInput = {
  type: string;
  payload?: unknown;
  runAt?: string | null;
};

export async function enqueueJob(input: QueueJobInput): Promise<{ id: string; backend: 'redis' | 'database' }> {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      const dynamicImport = new Function('m', 'return import(m)') as (moduleName: string) => Promise<any>;
      const redis = await dynamicImport('redis');
      const client = redis.createClient({ url: redisUrl });
      await client.connect();
      const id = cryptoRandomId();
      await client.lPush(
        process.env.REDIS_QUEUE_KEY || 'b2b:jobs',
        JSON.stringify({ id, type: input.type, payload: input.payload ?? null, runAt: input.runAt ?? null })
      );
      await client.quit();
      return { id, backend: 'redis' };
    } catch {
      // Fallback to DB queue when Redis package/server is unavailable.
    }
  }

  const connection = await pool.getConnection();
  try {
    const id = cryptoRandomId();
    await connection.query(
      'INSERT INTO jobs (id, type, payload, status, runAt) VALUES (?, ?, ?, ?, ?)',
      [id, input.type, input.payload ? JSON.stringify(input.payload) : null, 'queued', input.runAt ?? null]
    );
    return { id, backend: 'database' };
  } finally {
    connection.release();
  }
}

export async function getQueuedJobs(limit = 50): Promise<any[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT id, type, payload, status, attempts, lastError, runAt, createdAt, updatedAt
       FROM jobs
       ORDER BY createdAt DESC
       LIMIT ?`,
      [limit]
    );
    return rows as any[];
  } finally {
    connection.release();
  }
}

export async function markJobStatus(id: string, status: 'processing' | 'completed' | 'failed', lastError?: string): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      'UPDATE jobs SET status = ?, attempts = attempts + 1, lastError = ? WHERE id = ?',
      [status, lastError ?? null, id]
    );
  } finally {
    connection.release();
  }
}

function cryptoRandomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const r = Math.random() * 16 | 0;
    const v = char === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

