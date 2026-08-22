import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/apiError';

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('❌', err.message);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  // Mongoose validation errors — surface field-level messages instead of a generic 500
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }

  // Mongoose duplicate key error (e.g. unique email/slug violated)
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern ?? {})[0] ?? 'field';
    return res.status(409).json({ success: false, message: `This ${field} is already in use` });
  }

  return res.status(500).json({ success: false, message: 'Internal server error' });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};