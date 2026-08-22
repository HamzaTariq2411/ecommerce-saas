import { Router } from 'express';
import { register, login, getMe } from './auth.controller';
import { protect } from '@/middlewares/auth.middleware';
import { registerSchema, loginSchema } from './auth.validator';
import { validate } from '@/middlewares/validate.middleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

export default router;