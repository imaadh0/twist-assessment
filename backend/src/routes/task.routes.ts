import { Router } from 'express';
import { getTasks, getTask, createTask, updateTask, deleteTask, getTaskStats } from '../controllers/task.controller';
import { createTaskValidation, listTasksValidation, updateTaskValidation } from '../validators/task.validators';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// all task routes require authentication
router.use(authenticate);

router.get('/', listTasksValidation, validate, getTasks);
router.get('/stats', getTaskStats);
router.get('/:id', getTask);
router.post('/', createTaskValidation, validate, createTask);
router.put('/:id', updateTaskValidation, validate, updateTask);
router.delete('/:id', deleteTask);

export default router;
