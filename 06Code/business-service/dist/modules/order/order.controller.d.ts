import { Request, Response, NextFunction } from 'express';
export declare const orderController: {
    placeOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAll: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMyOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getByReference: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    changeStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    approveCustomized: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
