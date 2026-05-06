import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import liveRoutes from './routes/live.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', liveRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'Sports A backend' });
});

app.use(errorHandler);

export default app;
