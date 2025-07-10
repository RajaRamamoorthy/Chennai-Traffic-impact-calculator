import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

/**
 * Middleware to add unique request ID for tracking and debugging
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = req.headers['x-request-id'] as string || nanoid();
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);
  next();
}