import request from 'supertest';
import { app } from '../src';
import { writeJson } from '../src/services/fileService';
import path from 'path';

const booksFilePath = path.join(__dirname, '../data/books.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

describe('Book Endpoints', () => {
  let authToken: string;
  let userId: string;

  const testUser = {
    username: 'testuser',
    password: 'password123',
    email: 'test@example.com'
  };

  const testBook = {
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Fiction',
    publishedYear: 2024
  };

  beforeAll(async () => {
    // Reset data files
    await writeJson(booksFilePath, []);
    
    // Register and login to get auth token
    const registerRes = await request(app)
      .post('/api/register')
      .send(testUser);

    console.log('Register response:', registerRes.body);

    const loginRes = await request(app)
      .post('/api/login')
      .send({
        username: testUser.username,
        password: testUser.password
      });

    console.log('Login response:', loginRes.body);

    authToken = loginRes.body.token;
    userId = loginRes.body.user.id;
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBook);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe(testBook.title);
      expect(res.body.userId).toBe(userId);
    });

    it('should not create a book without authentication', async () => {
      const res = await request(app)
        .post('/api/books')
        .send(testBook);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Access token is missing or invalid');
    });
  });

  describe('GET /api/books', () => {
    beforeEach(async () => {
      // Create a test book
      await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBook);
    });

    it('should get all books with pagination', async () => {
      const res = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter books by genre', async () => {
      // Create a book with different genre
      await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...testBook, genre: 'Mystery' });

      const res = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ genre: 'Mystery' });

      expect(res.status).toBe(200);
      expect(res.body.data.every((book: any) => book.genre === 'Mystery')).toBe(true);
    });
  });

  describe('PUT /api/books/:id', () => {
    let bookId: string;

    beforeEach(async () => {
      // Create a book to update
      const createRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBook);
      bookId = createRes.body.id;
    });

    it('should update a book', async () => {
      const updateData = {
        title: 'Updated Title',
        author: 'Updated Author',
        genre: 'Updated Genre',
        publishedYear: 2025
      };

      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe(updateData.title);
      expect(res.body.author).toBe(updateData.author);
    });

    it('should not update a book created by another user', async () => {
      // Create another user
      const anotherUser = { ...testUser, username: 'anotheruser', email: 'another@example.com' };
      const registerRes = await request(app)
        .post('/api/register')
        .send(anotherUser);

      const loginRes = await request(app)
        .post('/api/login')
        .send({
          username: anotherUser.username,
          password: anotherUser.password
        });

      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${loginRes.body.token}`)
        .send({ title: 'Unauthorized Update' });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Unauthorized');
    });
  });

  describe('DELETE /api/books/:id', () => {
    let bookId: string;

    beforeEach(async () => {
      // Create a book to delete
      const createRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBook);
      bookId = createRes.body.id;
    });

    it('should delete a book', async () => {
      const res = await request(app)
        .delete(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Book deleted successfully');

      // Verify book is deleted
      const getRes = await request(app)
        .get(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(getRes.status).toBe(404);
    });

    it('should not delete a book created by another user', async () => {
      // Create another user
      const anotherUser = { ...testUser, username: 'anotheruser2', email: 'another2@example.com' };
      const registerRes = await request(app)
        .post('/api/register')
        .send(anotherUser);

      const loginRes = await request(app)
        .post('/api/login')
        .send({
          username: anotherUser.username,
          password: anotherUser.password
        });

      const res = await request(app)
        .delete(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${loginRes.body.token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Unauthorized');
    });
  });
}); 