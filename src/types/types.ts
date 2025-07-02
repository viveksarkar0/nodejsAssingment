import { Request } from 'express';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
} 