import { body } from 'express-validator';

export const createTaskValidation = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 200 }).withMessage('Title must be under 200 characters')
        .trim()
        .escape(),
    body('description')
        .optional()
        .isLength({ max: 2000 }).withMessage('Description must be under 2000 characters')
        .trim()
        .escape(),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
    body('dueDate')
        .optional()
        .isISO8601().withMessage('Due date must be a valid date'),
];

export const updateTaskValidation = [
    body('title')
        .optional()
        .isLength({ max: 200 }).withMessage('Title must be under 200 characters')
        .trim()
        .escape(),
    body('description')
        .optional()
        .isLength({ max: 2000 }).withMessage('Description must be under 2000 characters')
        .trim()
        .escape(),
    body('completed')
        .optional()
        .isBoolean().withMessage('Completed must be a boolean'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
    body('dueDate')
        .optional({ values: 'null' })
        .isISO8601().withMessage('Due date must be a valid date'),
];
