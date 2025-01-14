import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/config';
import { errorHandler } from './middleware/errors';
import routes from './routes';
import logger, { stream } from './utils/logger';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev', { stream }));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});