"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const http_errors_1 = require("../errors/http.errors");
function errorMiddleware(error, _req, res, _next) {
    if (error instanceof http_errors_1.HttpError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
        return;
    }
    console.error('[UnhandledError]', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
}
//# sourceMappingURL=error.middleware.js.map