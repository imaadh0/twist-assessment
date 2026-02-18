import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { JwtPayload } from '../types';

export function generateAccessToken(payload: JwtPayload): string {
    const options: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRY as any };
    return jwt.sign({ ...payload }, env.JWT_ACCESS_SECRET as Secret, options);
}

export function generateRefreshToken(payload: JwtPayload): string {
    const options: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRY as any };
    return jwt.sign({ ...payload }, env.JWT_REFRESH_SECRET as Secret, options);
}

export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET as Secret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET as Secret) as JwtPayload;
}

// hash refresh token with SHA-256 before storing in DB
export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

