import crudClient from '../../shared/http/crud.client';

type Order = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  details: { quantity: number; unitPrice: number }[];
};

function isOrderWithinDateRange(order: Order, startDate: Date, endDate: Date): boolean {
  const orderDate = new Date(order.createdAt);
  return orderDate >= startDate && orderDate <= endDate;
}

function aggregateSalesSummary(orders: Order[]) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statusBreakdown = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders,
    averageOrderValue: Number(averageOrderValue.toFixed(2)),
    statusBreakdown,
  };
}

export const reportService = {
  getSalesReport: async (startDateStr?: string, endDateStr?: string) => {
    const response = await crudClient.get('/api/order');
    const allOrders: Order[] = response.data.data;

    const startDate = startDateStr ? new Date(startDateStr) : new Date(0);
    const endDate = endDateStr ? new Date(endDateStr) : new Date();

    const filteredOrders = allOrders.filter((order) =>
      isOrderWithinDateRange(order, startDate, endDate)
    );

    return {
      period: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
      summary: aggregateSalesSummary(filteredOrders),
      orders: filteredOrders,
    };
  },
};
