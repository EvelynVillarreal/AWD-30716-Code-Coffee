"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = void 0;
const crud_client_1 = __importDefault(require("../../shared/http/crud.client"));
function isOrderWithinDateRange(order, startDate, endDate) {
    const orderDate = new Date(order.createdAt);
    return orderDate >= startDate && orderDate <= endDate;
}
function aggregateSalesSummary(orders) {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const statusBreakdown = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1;
        return acc;
    }, {});
    return {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders,
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
        statusBreakdown,
    };
}
exports.reportService = {
    getSalesReport: async (startDateStr, endDateStr) => {
        const response = await crud_client_1.default.get('/api/orders');
        const allOrders = response.data.data;
        const startDate = startDateStr ? new Date(startDateStr) : new Date(0);
        const endDate = endDateStr ? new Date(endDateStr) : new Date();
        const filteredOrders = allOrders.filter((order) => isOrderWithinDateRange(order, startDate, endDate));
        return {
            period: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
            summary: aggregateSalesSummary(filteredOrders),
            orders: filteredOrders,
        };
    },
};
//# sourceMappingURL=report.service.js.map