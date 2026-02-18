import bcrypt from 'bcryptjs';
import db from '../config/db';
import { ApiError } from '../utils/ApiError';
import { generateAccessToken, generateRefreshToken, hashToken, verifyRefreshToken } from '../utils/token';
import { env } from '../config/env';

export class AuthService {
    async register(email: string, password: string) {
        // check if user already exists
        const existing = await db.user.findUnique({ where: { email } });
        if (existing) {
            throw new ApiError(409, 'Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await db.user.create({
            data: { email, password: hashedPassword },
            select: { id: true, email: true, createdAt: true },
        });

        return user;
    }

    async login(email: string, password: string) {
        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const payload = { userId: user.id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // store hashed refresh token in DB
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await db.refreshToken.create({
            data: {
                tokenHash: hashToken(refreshToken),
                userId: user.id,
                expiresAt,
            },
        });

        return {
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email },
        };
    }

    async refresh(currentRefreshToken: string) {
        // verify the JWT signature first
        let decoded;
        try {
            decoded = verifyRefreshToken(currentRefreshToken);
        } catch {
            throw new ApiError(401, 'Invalid refresh token');
        }

        // find the hashed token in DB
        const tokenHash = hashToken(currentRefreshToken);
        const storedToken = await db.refreshToken.findFirst({
            where: {
                tokenHash,
                userId: decoded.userId,
                expiresAt: { gt: new Date() },
            },
        });

        if (!storedToken) {
            throw new ApiError(401, 'Refresh token not found or expired');
        }

        // rotate: delete old token, issue new pair
        await db.refreshToken.delete({ where: { id: storedToken.id } });

        const payload = { userId: decoded.userId, email: decoded.email };
        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await db.refreshToken.create({
            data: {
                tokenHash: hashToken(newRefreshToken),
                userId: decoded.userId,
                expiresAt,
            },
        });

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    async logout(refreshToken: string) {
        if (!refreshToken) return;

        const tokenHash = hashToken(refreshToken);
        // delete the token if it exists, ignore if not found
        await db.refreshToken.deleteMany({ where: { tokenHash } });
    }
}

export const authService = new AuthService();
