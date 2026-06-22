"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const crudClient = axios_1.default.create({
    baseURL: process.env.CRUD_SERVICE_URL ?? 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});
crudClient.interceptors.response.use((response) => response, (error) => {
    const message = error.response?.data?.message ?? error.message;
    const status = error.response?.status ?? 500;
    const serviceError = new Error(message);
    serviceError.statusCode = status;
    return Promise.reject(serviceError);
});
exports.default = crudClient;
//# sourceMappingURL=crud.client.js.map