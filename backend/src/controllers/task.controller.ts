import { Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { AuthRequest } from '../types';

export async function getTasks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const tasks = await taskService.getAll(req.user!.userId);
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
