import { Request, Response, NextFunction } from 'express';
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
export declare function requireAuth(req: Request, _res: Response, next: NextFunction): void;
export declare function requireAdmin(req: Request, res: Response, next: NextFunction): void;
