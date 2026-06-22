import { Request, Response, NextFunction } from 'express';
export declare function errorMiddleware(error: Error & {
    statusCode?: number;
}, _req: Request, res: Response, _next: NextFunction): void;
