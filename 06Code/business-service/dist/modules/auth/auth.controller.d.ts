import { Request, Response, NextFunction } from 'express';
export declare const authController: {
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    profile: (req: Request, res: Response) => void;
};
