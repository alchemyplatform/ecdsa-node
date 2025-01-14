import { Request, Response, NextFunction } from 'express';
import { WalletError, CryptoError, TransactionError, ValidationError } from '../core/errors';
import logger from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(error);

  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message
    });
  }

  if (error instanceof WalletError) {
    return res.status(400).json({
      error: 'Wallet Error',
      message: error.message
    });
  }

  if (error instanceof CryptoError) {
    return res.status(500).json({
      error: 'Crypto Error',
      message: error.message
    });
  }

  if (error instanceof TransactionError) {
    return res.status(400).json({
      error: 'Transaction Error',
      message: error.message
    });
  }

  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
};