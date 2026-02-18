export interface User {
    id: string;
    email: string;
}

export interface Task {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    completionRate: number;
    byPriority: {
        high: number;
        medium: number;
        low: number;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: boolean;
    message: string;
    errors?: { field?: string; message: string }[];
}
