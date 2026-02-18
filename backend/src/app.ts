import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

const app = express();

// security middleware
app.use(helmet());
app.use(hpp());
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true, // needed for cookies
}));
app.use(generalLimiter);

// body parsing
app.use(express.json({ limit: '10kb' })); // limit body size
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// health check
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// global error handler (must be last)
app.use(errorHandler);

export default app;
