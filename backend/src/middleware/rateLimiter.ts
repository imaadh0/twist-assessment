import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

// general rate limiter for all routes
export const generalLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    message: { success: false, message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// stricter limiter for auth endpoints to prevent brute force
export const authLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.AUTH_RATE_LIMIT_MAX,
    message: { success: false, message: 'Too many auth attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});
