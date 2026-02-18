import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from '../types';

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Access token required');
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(401, 'Invalid or expired access token'));
        }
    }
}
