import { Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../types';
import { env } from '../config/env';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const user = await authService.register(email, password);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        // set refresh token as httpOnly cookie
        res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

        // send access token in response body (stored in memory on client)
        res.json({
            success: true,
            data: {
                accessToken: result.accessToken,
                user: result.user,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ success: false, message: 'Refresh token required' });
            return;
        }

        const result = await authService.refresh(refreshToken);

        // set new refresh token cookie (rotation)
        res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

        res.json({
            success: true,
            data: { accessToken: result.accessToken },
        });
    } catch (error) {
        next(error);
    }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies?.refreshToken;
        await authService.logout(refreshToken);

        // clear the cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/api/auth',
        });

        res.json({ success: true, message: 'Logged out' });
    } catch (error) {
        next(error);
    }
}
