export declare class HttpError extends Error {
    readonly statusCode: number;
    constructor(statusCode: number, message: string);
}
export declare class NotFoundError extends HttpError {
    constructor(resource: string);
}
export declare class BadRequestError extends HttpError {
    constructor(message: string);
}
export declare class ConflictError extends HttpError {
    constructor(message: string);
}
//# sourceMappingURL=http.errors.d.ts.map