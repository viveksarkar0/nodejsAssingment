import { Router, Request, Response } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    await register(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    await login(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 