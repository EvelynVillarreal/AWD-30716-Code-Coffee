import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http.errors';

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof HttpError) {
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
