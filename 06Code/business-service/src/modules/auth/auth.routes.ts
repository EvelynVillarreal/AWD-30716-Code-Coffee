import { Router } from 'express';
import { authController } from './auth.controller';
import { requireAuth } from '../../shared/middleware/auth.middleware';

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/profile', requireAuth, authController.profile);

export default authRouter;
