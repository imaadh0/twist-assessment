import db from '../config/db';
import { ApiError } from '../utils/ApiError';
import { CreateTaskInput, UpdateTaskInput } from '../types';

export class TaskService {
    async getAll(userId: string) {
        return db.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getById(taskId: string, userId: string) {
        const task = await db.task.findFirst({
            where: { id: taskId, userId },
        });
        if (!task) {
            throw new ApiError(404, 'Task not found');
        }
        return task;
    }

    async create(userId: string, data: CreateTaskInput) {
        return db.task.create({
            data: {
                title: data.title,
                description: data.description,
                priority: data.priority || 'medium',
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                userId,
            },
        });
    }

    async update(taskId: string, userId: string, data: UpdateTaskInput) {
        // check ownership first
        const task = await db.task.findFirst({
            where: { id: taskId, userId },
        });
        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        return db.task.update({
            where: { id: taskId },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.completed !== undefined && { completed: data.completed }),
                ...(data.priority !== undefined && { priority: data.priority }),
                ...(data.dueDate !== undefined && {
                    dueDate: data.dueDate ? new Date(data.dueDate) : null,
                }),
            },
        });
    }

    async delete(taskId: string, userId: string) {
        // check ownership - prevents deleting another user's task
        const task = await db.task.findFirst({
            where: { id: taskId, userId },
        });
        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        await db.task.delete({ where: { id: taskId } });
        return { message: 'Task deleted successfully' };
    }

    // novelty: task stats for the dashboard
    async getStats(userId: string) {
        const tasks = await db.task.findMany({ where: { userId } });
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const overdue = tasks.filter(t =>
            !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
        ).length;

        const byPriority = {
            high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
            medium: tasks.filter(t => t.priority === 'medium' && !t.completed).length,
            low: tasks.filter(t => t.priority === 'low' && !t.completed).length,
        };

        return {
            total,
            completed,
            pending: total - completed,
            overdue,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            byPriority,
        };
    }
}

export const taskService = new TaskService();
