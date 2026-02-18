import dotenv from 'dotenv';
dotenv.config();

// validate required env vars early
const requiredVars = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
for (const varName of requiredVars) {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
}

export const env = {
    PORT: parseInt(process.env.PORT || '5000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    AUTH_RATE_LIMIT_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10),
};
