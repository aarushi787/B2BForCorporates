import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { enqueueJob, getQueuedJobs, markJobStatus } from '../services/jobQueue.js';
import { createAuditLog } from '../utils/audit.js';

const router = Router();

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type, payload, runAt } = req.body as { type?: string; payload?: unknown; runAt?: string | null };
    if (!type) {
      return res.status(400).json({ error: 'type is required' });
    }
    const job = await enqueueJob({ type, payload, runAt: runAt ?? null });

    await createAuditLog({
      userId: req.userId,
      companyId: req.companyId,
      action: 'JOB_ENQUEUED',
      resourceType: 'job',
      resourceId: job.id,
      metadata: { type, backend: job.backend },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Enqueue job error:', error);
    res.status(500).json({ error: 'Failed to enqueue job' });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const jobs = await getQueuedJobs(limit);
    res.json(jobs);
  } catch (error) {
    console.error('List jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.put('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const status = req.body.status as 'processing' | 'completed' | 'failed';
    if (!['processing', 'completed', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Use processing, completed, or failed.' });
    }
    await markJobStatus(req.params.id, status, req.body.lastError);
    res.json({ id: req.params.id, status });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({ error: 'Failed to update job status' });
  }
});

export default router;

