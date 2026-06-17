import { Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { AuthRequest, TaskListQuery } from '../types';

export async function getTasks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const filters: TaskListQuery = {
            q: typeof req.query.q === 'string' ? req.query.q : undefined,
            status: typeof req.query.status === 'string' ? req.query.status as TaskListQuery['status'] : undefined,
            priority: typeof req.query.priority === 'string' ? req.query.priority as TaskListQuery['priority'] : undefined,
            due: typeof req.query.due === 'string' ? req.query.due as TaskListQuery['due'] : undefined,
            sort: typeof req.query.sort === 'string' ? req.query.sort as TaskListQuery['sort'] : undefined,
        };
        const tasks = await taskService.getAll(req.user!.userId, filters);
        res.json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
}

export async function getTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const task = await taskService.getById(req.params.id as string, req.user!.userId);
        res.json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
}

export async function createTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const task = await taskService.create(req.user!.userId, req.body);
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
}

export async function updateTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const task = await taskService.update(req.params.id as string, req.user!.userId, req.body);
        res.json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
}

export async function deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const result = await taskService.delete(req.params.id as string, req.user!.userId);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getTaskStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const stats = await taskService.getStats(req.user!.userId);
        res.json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
}
