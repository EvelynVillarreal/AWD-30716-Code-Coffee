export declare class BusinessError extends Error {
    readonly statusCode: number;
    constructor(statusCode: number, message: string);
}
export declare class InsufficientStockError extends BusinessError {
    constructor(productId: number, available: number, requested: number);
}
export declare class InvalidOrderStatusTransitionError extends BusinessError {
    constructor(currentStatus: string, targetStatus: string);
}
export declare class UnauthorizedError extends BusinessError {
    constructor(message?: string);
}
export declare class ForbiddenError extends BusinessError {
    constructor(message?: string);
}
