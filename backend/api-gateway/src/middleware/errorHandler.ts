import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Unhandled error', { message: err.message, stack: err.stack, url: req.originalUrl });
  res.status(500).json({
    error: 'InternalServerError',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
  });
}
