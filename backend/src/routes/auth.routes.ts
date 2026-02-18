import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../validators/auth.validators';
import { validate } from '../middleware/validate.middleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
