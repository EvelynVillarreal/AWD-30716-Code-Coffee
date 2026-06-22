"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.BadRequestError = exports.NotFoundError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'HttpError';
    }
}
exports.HttpError = HttpError;
class NotFoundError extends HttpError {
    constructor(resource) {
        super(404, `${resource} not found`);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends HttpError {
    constructor(message) {
        super(400, message);
        this.name = 'BadRequestError';
    }
}
exports.BadRequestError = BadRequestError;
class ConflictError extends HttpError {
    constructor(message) {
        super(409, message);
        this.name = 'ConflictError';
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=http.errors.js.map