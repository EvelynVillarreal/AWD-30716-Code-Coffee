"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.UnauthorizedError = exports.InvalidOrderStatusTransitionError = exports.InsufficientStockError = exports.BusinessError = void 0;
class BusinessError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'BusinessError';
    }
}
exports.BusinessError = BusinessError;
class InsufficientStockError extends BusinessError {
    constructor(productId, available, requested) {
        super(409, `Product ${productId} has insufficient stock. Available: ${available}, requested: ${requested}`);
        this.name = 'InsufficientStockError';
    }
}
exports.InsufficientStockError = InsufficientStockError;
class InvalidOrderStatusTransitionError extends BusinessError {
    constructor(currentStatus, targetStatus) {
        super(422, `Cannot transition order from "${currentStatus}" to "${targetStatus}"`);
        this.name = 'InvalidOrderStatusTransitionError';
    }
}
exports.InvalidOrderStatusTransitionError = InvalidOrderStatusTransitionError;
class UnauthorizedError extends BusinessError {
    constructor(message = 'Unauthorized') {
        super(401, message);
        this.name = 'UnauthorizedError';
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends BusinessError {
    constructor(message = 'Forbidden') {
        super(403, message);
        this.name = 'ForbiddenError';
    }
}
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=business.errors.js.map