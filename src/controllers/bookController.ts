import path from 'path';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest, Book } from '../types/types';
import { readJson, writeJson } from '../services/fileService';


const booksFilePath = path.resolve(__dirname, '../../data/books.json');

interface QueryParams {
  page?: string;
  limit?: string;
  genre?: string;
}

export const getAllBooks = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const { page = '1', limit = '10', genre } = req.query as QueryParams;
    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10)));
    
    // Initialize books array with empty array if file doesn't exist
    let books: Book[] = [];
    try {
      books = await readJson(booksFilePath);
      // Filter out incomplete book entries
      books = books.filter(book => 
        book.id && 
        book.title && 
        book.author && 
        book.genre && 
        typeof book.publishedYear === 'number' && 
        book.userId
      );
    } catch (error) {
      books = [];
      await writeJson(booksFilePath, books);
    }
    
    // Apply genre filter if provided
    if (genre) {
      books = books.filter(book => book.genre && book.genre.toLowerCase() === genre.toLowerCase());
    }
    
    // Calculate pagination
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = pageNumber * limitNumber;
    const totalBooks = books.length;
    
    // Prepare pagination metadata
    const pagination = {
      total: totalBooks,
      totalPages: Math.ceil(totalBooks / limitNumber),
      currentPage: pageNumber,
      limit: limitNumber,
      hasNext: endIndex < totalBooks,
      hasPrevious: startIndex > 0
    };
    
    // Get paginated books
    const paginatedBooks = books.slice(startIndex, endIndex);
    
    return res.status(200).json({
      data: paginatedBooks,
      pagination
    });
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookById = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const books: Book[] = await readJson(booksFilePath);
    const book = books.find(book => book.id === id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const addBook = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const { title, author, genre, publishedYear } = req.body;
  const userId = req.user?.id;

  // Validate required fields
  if (!title || !author || !genre || !publishedYear) {
    return res.status(400).json({ message: 'Title, author, genre, and publishedYear are required' });
  }

  // Validate data types
  if (typeof title !== 'string' || typeof author !== 'string' || typeof genre !== 'string' || typeof publishedYear !== 'number') {
    return res.status(400).json({ message: 'Invalid data types. Title, author, and genre must be strings, publishedYear must be a number' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const books: Book[] = await readJson(booksFilePath);
    const newBook: Book = { 
      id: uuidv4(), 
      title: title.trim(), 
      author: author.trim(), 
      genre: genre.trim(), 
      publishedYear, 
      userId 
    };
    books.push(newBook);
    await writeJson(booksFilePath, books);
    return res.status(201).json(newBook);
  } catch (error) {
    console.error('Error in addBook:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBook = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { title, author, genre, publishedYear } = req.body;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  try {
    const books: Book[] = await readJson(booksFilePath);
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (books[bookIndex].userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    books[bookIndex] = { ...books[bookIndex], title, author, genre, publishedYear };
    await writeJson(booksFilePath, books);
    return res.status(200).json(books[bookIndex]);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteBook = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const { id } = req.params;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  try {
    const books: Book[] = await readJson(booksFilePath);
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (books[bookIndex].userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    books.splice(bookIndex, 1);
    await writeJson(booksFilePath, books);
    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 