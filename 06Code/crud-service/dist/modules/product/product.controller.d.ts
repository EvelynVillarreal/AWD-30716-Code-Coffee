import { Request, Response, NextFunction } from 'express';
export declare const productController: {
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateStock: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    remove: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=product.controller.d.ts.map