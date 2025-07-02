import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { readJson, writeJson } from '../services/fileService';
import { User } from '../types/types';

const usersFilePath = path.resolve(__dirname, '../../data/users.json');
const jwtSecret = process.env.JWT_SECRET || 'default_secret';

// Initialize users.json if it doesn't exist
const initializeUsersFile = async () => {
  try {
    await fs.access(usersFilePath);
  } catch (error) {
    await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
    await writeJson(usersFilePath, []);
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await initializeUsersFile();
    const users: User[] = await readJson(usersFilePath);
    
    // Check if username or email already exists
    const userExists = users.find(user => user.username === username || user.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword
    };

    // Add user to users array and save
    users.push(newUser);
    await writeJson(usersFilePath, users);

    // Return success message without user data
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in register:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    await initializeUsersFile();
    const users: User[] = await readJson(usersFilePath);
    
    // Find user by username or email
    const user = users.find(user => user.username === username || user.email === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      jwtSecret,
      { expiresIn: '24h' }
    );

    console.log('Login response:', {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 