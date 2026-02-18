import { Request } from 'express';

export interface JwtPayload {
    userId: string;
    email: string;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string | null;
}
