import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticateToken } from '../../middlewares/auth';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/me', authenticateToken, AuthController.getProfile);

export const AuthRoutes = router;