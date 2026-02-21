import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/auth.js';

// Import routes
import authRoutes from './routes/auth.js';
import companiesRoutes from './routes/companies.js';
import productsRoutes from './routes/products.js';
import dealsRoutes from './routes/deals.js';
import messagesRoutes from './routes/messages.js';
import ledgerRoutes from './routes/ledger.js';
import membersRoutes from './routes/members.js';
import notificationsRoutes from './routes/notifications.js';
import paymentsRoutes from './routes/payments.js';
import documentsRoutes from './routes/documents.js';
import reputationRoutes from './routes/reputation.js';
import auditRoutes from './routes/audit.js';
import jobsRoutes from './routes/jobs.js';
import complianceRoutes from './routes/compliance.js';
import kycRoutes from './routes/kyc.js';
import privacyRoutes from './routes/privacy.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Friendly root endpoints
app.get('/', (_req, res) => {
  res.json({
    name: 'B2B Nexus API',
    status: 'OK',
    health: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (_req, res) => {
  res.json({
    name: 'B2B Nexus API',
    status: 'OK',
    health: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/reputation', reputationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/privacy', privacyRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Database connected to ${process.env.DB_NAME || 'b2b_nexus_marketplace'}`);
  console.log(`CORS enabled for ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});
