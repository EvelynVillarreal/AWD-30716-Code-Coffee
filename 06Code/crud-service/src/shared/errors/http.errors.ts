export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export class NotFoundError extends HttpError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(400, message);
    this.name = 'BadRequestError';
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(409, message);
    this.name = 'ConflictError';
  }
}
