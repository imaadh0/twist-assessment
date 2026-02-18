import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export function validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.type === 'field' ? (err as any).path : undefined,
                message: err.msg,
            })),
        });
        return;
    }
    next();
}
