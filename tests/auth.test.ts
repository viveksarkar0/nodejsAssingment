import request from 'supertest';
import { app } from '../src';
import { writeJson } from '../src/services/fileService';
import path from 'path';

const usersFilePath = path.join(__dirname, '../data/users.json');

describe('Auth Endpoints', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };

  beforeAll(async () => {
    // Reset users file
    await writeJson(usersFilePath, []);
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: testUser.username,
        password: testUser.password
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('username', testUser.username);
  });
}); 