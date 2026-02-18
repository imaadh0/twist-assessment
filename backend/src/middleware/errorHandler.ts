import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    // known operational errors
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }

    // log unexpected errors server-side only
    console.error('Unexpected error:', err);

    // don't leak stack traces or internal details to client
    res.status(500).json({
        success: false,
        message: env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    });
}
