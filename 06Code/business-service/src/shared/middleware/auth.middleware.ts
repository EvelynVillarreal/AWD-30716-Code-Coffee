import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../errors/business.errors';

export type JwtPayload = {
  userId: number;
  email: string;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

function extractBearerToken(authHeader: string | undefined): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }
  return authHeader.split(' ')[1];
}

function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET ?? '';
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const token = extractBearerToken(req.headers.authorization);
    req.user = verifyToken(token);
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, (error) => {
    if (error) return next(error);
    if (req.user?.role !== 'admin') return next(new ForbiddenError('Admin access required'));
    next();
  });
}
