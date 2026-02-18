import { body } from 'express-validator';

export const registerValidation = [
    body('email')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail()
        .trim(),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain a number')
        .trim(),
];

export const loginValidation = [
    body('email')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail()
        .trim(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .trim(),
];
