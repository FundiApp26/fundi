import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';
import routes from './routes/index';
import { errorMiddleware } from './middleware/error.middleware';
import { initializeSocket } from './services/socket.service';
import { initializeQueues } from './jobs/queue';

const app = express();
const httpServer = createServer(app);

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

initializeSocket(httpServer);
try { initializeQueues(); } catch (err) { console.warn('[Queue] Redis not available, queues disabled'); }

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: '*', credentials: false }));
app.use(compression());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Serve admin dashboard at /admin
const adminDir = path.join(process.cwd(), '..', 'admin');
app.use('/admin', express.static(adminDir));
app.get('/admin', (_req, res) => {
  res.sendFile(path.join(adminDir, 'index.html'));
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);
app.use(errorMiddleware);

httpServer.listen(env.PORT, () => {
  console.log('[Server] Fundi API running on port ' + env.PORT);
  console.log('[Server] Environment: ' + env.NODE_ENV);
});

export default app;
