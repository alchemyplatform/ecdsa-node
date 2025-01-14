import { Request, Response, NextFunction } from 'express';

export const requestValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { sender, recipient, amount } = req.body;

  if (!sender || !recipient || !amount) {
    return res.status(400).json({ error: 'Missing required fields: sender, recipient, amount' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }

  next();
};
