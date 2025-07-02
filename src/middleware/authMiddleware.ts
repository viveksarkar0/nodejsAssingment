import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, AuthenticatedRequest } from '../types/types';

const jwtSecret = process.env.JWT_SECRET || 'default_secret';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access token is missing or invalid' });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      username: string;
      email: string;
    };

    (req as AuthenticatedRequest).user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      password: '' // We don't need the password in the request
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token has expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      res.status(403).json({ message: 'Token is not valid' });
    }
  }
}; 