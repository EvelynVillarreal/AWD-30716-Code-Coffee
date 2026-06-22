"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const crud_client_1 = __importDefault(require("../../shared/http/crud.client"));
const business_errors_1 = require("../../shared/errors/business.errors");
// Valid status flow for order lifecycle
const ALLOWED_STATUS_TRANSITIONS = {
    pending: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
};
function generateReferenceNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${randomSuffix}`;
}
async function fetchProductById(productId) {
    const response = await crud_client_1.default.get(`/api/products/${productId}`);
    return response.data.data;
}
async function fetchShippingCost(destinationProvince) {
    try {
        const response = await crud_client_1.default.get('/api/shipping-configs/lookup', {
            params: { baseProvince: 'Main', destinationProvince },
        });
        return response.data.data.additionalCost;
    }
    catch {
        return 0;
    }
}
async function validateAndFetchItems(items) {
    return Promise.all(items.map(async (item) => {
        const product = await fetchProductById(item.productId);
        if (product.stock < item.quantity) {
            throw new business_errors_1.InsufficientStockError(item.productId, product.stock, item.quantity);
        }
        return { product, item };
    }));
}
function calculateOrderTotal(validatedItems, shippingCost) {
    const subtotal = validatedItems.reduce((sum, { product, item }) => sum + product.price * item.quantity, 0);
    return Number((subtotal + shippingCost).toFixed(2));
}
async function decrementStockForItems(validatedItems) {
    await Promise.all(validatedItems.map(({ product, item }) => crud_client_1.default.patch(`/api/products/${product.id}/stock`, {
        stock: product.stock - item.quantity,
    })));
}
async function recordStatusHistory(orderId, status) {
    await crud_client_1.default.post('/api/order-status-history', { orderId, status });
}
exports.orderService = {
    placeOrder: async (input) => {
        const validatedItems = await validateAndFetchItems(input.items);
        const shippingCost = await fetchShippingCost(input.province);
        const total = calculateOrderTotal(validatedItems, shippingCost);
        const referenceNumber = generateReferenceNumber();
        const isCustomized = input.items.some((item) => item.customizationDetails);
        const orderResponse = await crud_client_1.default.post('/api/orders', {
            referenceNumber,
            userId: input.userId,
            contactName: input.contactName,
            email: input.email,
            phone: input.phone,
            address: input.address,
            province: input.province,
            shippingCost,
            total,
            status: 'pending',
            isCustomized,
        });
        const order = orderResponse.data.data;
        await crud_client_1.default.post('/api/order-details/bulk', {
            items: validatedItems.map(({ product, item }) => ({
                orderId: order.id,
                productId: product.id,
                quantity: item.quantity,
                unitPrice: product.price,
                customizationDetails: item.customizationDetails,
            })),
        });
        await recordStatusHistory(order.id, 'pending');
        await decrementStockForItems(validatedItems);
        return order;
    },
    changeOrderStatus: async (orderId, newStatus) => {
        const orderResponse = await crud_client_1.default.get(`/api/orders/${orderId}`);
        const order = orderResponse.data.data;
        const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[order.status] ?? [];
        if (!allowedTransitions.includes(newStatus)) {
            throw new business_errors_1.InvalidOrderStatusTransitionError(order.status, newStatus);
        }
        await crud_client_1.default.patch(`/api/orders/${orderId}/status`, { status: newStatus });
        await recordStatusHistory(orderId, newStatus);
        return { ...order, status: newStatus };
    },
    approveCustomizedOrder: async (orderId) => {
        const orderResponse = await crud_client_1.default.get(`/api/orders/${orderId}`);
        const order = orderResponse.data.data;
        if (!order.isCustomized) {
            throw new business_errors_1.BusinessError(422, 'This order is not a customized order');
        }
        if (order.status !== 'pending') {
            throw new business_errors_1.BusinessError(422, 'Only pending customized orders can be approved');
        }
        return exports.orderService.changeOrderStatus(orderId, 'processing');
    },
    getOrderByReference: async (referenceNumber) => {
        const response = await crud_client_1.default.get(`/api/orders/reference/${referenceNumber}`);
        return response.data.data;
    },
    getOrdersByUser: async (userId) => {
        const response = await crud_client_1.default.get(`/api/orders/user/${userId}`);
        return response.data.data;
    },
    getAllOrders: async () => {
        const response = await crud_client_1.default.get('/api/orders');
        return response.data.data;
    },
};
//# sourceMappingURL=order.service.js.map