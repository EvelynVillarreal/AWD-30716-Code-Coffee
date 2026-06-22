"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const crud_client_1 = __importDefault(require("../../shared/http/crud.client"));
exports.productService = {
    getAllProducts: async (categoryId) => {
        const response = await crud_client_1.default.get('/api/products', {
            params: categoryId ? { categoryId } : undefined,
        });
        return response.data.data;
    },
    getProductById: async (id) => {
        const response = await crud_client_1.default.get(`/api/products/${id}`);
        return response.data.data;
    },
    createProduct: async (data) => {
        const response = await crud_client_1.default.post('/api/products', data);
        return response.data.data;
    },
    updateProduct: async (id, data) => {
        const response = await crud_client_1.default.put(`/api/products/${id}`, data);
        return response.data.data;
    },
    updateStock: async (id, stock) => {
        const response = await crud_client_1.default.patch(`/api/products/${id}/stock`, { stock });
        return response.data.data;
    },
    deleteProduct: async (id) => {
        await crud_client_1.default.delete(`/api/products/${id}`);
    },
    getAllCategories: async () => {
        const response = await crud_client_1.default.get('/api/categories');
        return response.data.data;
    },
};
//# sourceMappingURL=product.service.js.map