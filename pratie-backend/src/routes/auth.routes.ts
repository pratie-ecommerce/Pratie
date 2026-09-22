import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validator.js';
import { RegisterSchema, LoginSchema } from '../types/index.js';
import { authenticateJwt } from '../middlewares/auth.js';

const router = Router();

router.post('/register', validateBody(RegisterSchema), register);
router.post('/login', validateBody(LoginSchema), login);
router.get('/me', authenticateJwt, getMe);

export default router;
