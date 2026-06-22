import { Request, Response, NextFunction } from 'express';
export declare const orderController: {
    getAll: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getByReferenceNumber: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getByUserId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    remove: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=order.controller.d.ts.map