import { Router, Request, Response, NextFunction } from 'express';
import { getAllBooks, getBookById, addBook, updateBook, deleteBook } from '../controllers/bookController';
import { authenticateToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../types/types';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - genre
 *         - publishedYear
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated UUID of the book
 *         title:
 *           type: string
 *           description: Title of the book
 *         author:
 *           type: string
 *           description: Author of the book
 *         genre:
 *           type: string
 *           description: Genre of the book
 *         publishedYear:
 *           type: number
 *           description: Year the book was published
 *         userId:
 *           type: string
 *           description: ID of the user who added the book
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books with pagination and filtering
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter books by genre
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrevious:
 *                       type: boolean
 */
router.get('/books', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  getAllBooks(req as AuthenticatedRequest, res).catch(next);
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router.get('/books/:id', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  getBookById(req as AuthenticatedRequest, res).catch(next);
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - genre
 *               - publishedYear
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               publishedYear:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */
router.post('/books', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  addBook(req as AuthenticatedRequest, res).catch(next);
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               publishedYear:
 *                 type: number
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       403:
 *         description: Unauthorized - can only update own books
 */
router.put('/books/:id', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  updateBook(req as AuthenticatedRequest, res).catch(next);
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       403:
 *         description: Unauthorized - can only delete own books
 */
router.delete('/books/:id', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  deleteBook(req as AuthenticatedRequest, res).catch(next);
});

export default router; 