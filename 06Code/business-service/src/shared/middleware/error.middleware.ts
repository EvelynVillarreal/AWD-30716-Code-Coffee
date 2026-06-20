import { Request, Response, NextFunction } from 'express';
import { BusinessError } from '../errors/business.errors';

export function errorMiddleware(
  error: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof BusinessError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (error.statusCode) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  console.error('[UnhandledError]', error);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
