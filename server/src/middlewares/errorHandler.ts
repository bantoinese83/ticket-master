import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log error details
  logger.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
} 