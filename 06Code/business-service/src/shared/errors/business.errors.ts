export class BusinessError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'BusinessError';
  }
}

export class InsufficientStockError extends BusinessError {
  constructor(productId: number, available: number, requested: number) {
    super(
      409,
      `Product ${productId} has insufficient stock. Available: ${available}, requested: ${requested}`
    );
    this.name = 'InsufficientStockError';
  }
}

export class InvalidOrderStatusTransitionError extends BusinessError {
  constructor(currentStatus: string, targetStatus: string) {
    super(422, `Cannot transition order from "${currentStatus}" to "${targetStatus}"`);
    this.name = 'InvalidOrderStatusTransitionError';
  }
}

export class UnauthorizedError extends BusinessError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends BusinessError {
  constructor(message = 'Forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}
