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

export interface TaskListQuery {
    q?: string;
    status?: 'completed' | 'pending';
    priority?: 'low' | 'medium' | 'high';
    due?: 'overdue' | 'upcoming' | 'no-date';
    sort?: 'created-desc' | 'created-asc' | 'due-asc' | 'priority-desc';
}
