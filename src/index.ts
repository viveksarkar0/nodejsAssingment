import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { logger } from './middleware/logger';
import './config';

dotenv.config();

export const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logger);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', authRoutes);
app.use('/api', bookRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} 