import crudClient from '../../shared/http/crud.client';

type Order = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  contactName: string;
  email: string;
  details: { quantity: number; unitPrice: number; productId: number }[];
};

function isOrderWithinDateRange(order: Order, startDate: Date, endDate: Date): boolean {
  const orderDate = new Date(order.createdAt);
  return orderDate >= startDate && orderDate <= endDate;
}

function aggregateSalesSummary(orders: Order[], products: any[]) {
  const totalRevenue = orders
    .filter(order => order.status !== 'pending' && order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statusBreakdown = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const productSales: Record<number, { name: string; quantity: number; revenue: number }> = {};
  const customerSales: Record<string, { name: string; email: string; totalSpent: number; ordersCount: number }> = {};

  for (const order of orders) {
    if (order.status !== 'cancelled') {
      // Customer aggregation
      const email = order.email;
      if (!customerSales[email]) {
        customerSales[email] = { name: order.contactName, email, totalSpent: 0, ordersCount: 0 };
      }
      customerSales[email].totalSpent += order.total;
      customerSales[email].ordersCount += 1;

      // Product aggregation
      for (const detail of order.details) {
        if (!productSales[detail.productId]) {
          const product = products.find(p => p.id === detail.productId);
          productSales[detail.productId] = { 
            name: product ? product.name : `Product #${detail.productId}`, 
            quantity: 0, 
            revenue: 0 
          };
        }
        productSales[detail.productId].quantity += detail.quantity;
        productSales[detail.productId].revenue += detail.quantity * detail.unitPrice;
      }
    }
  }

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  const topCustomers = Object.values(customerSales)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders,
    averageOrderValue: Number(averageOrderValue.toFixed(2)),
    statusBreakdown,
    topProducts,
    topCustomers
  };
}

export const reportService = {
  getSalesReport: async (startDateStr?: string, endDateStr?: string) => {
    const [orderResponse, productResponse] = await Promise.all([
      crudClient.get('/api/order'),
      crudClient.get('/api/product')
    ]);
    const allOrders: Order[] = orderResponse.data.data;
    const allProducts = productResponse.data.data;

    const startDate = startDateStr ? new Date(startDateStr) : new Date(0);
    const endDate = endDateStr ? new Date(endDateStr) : new Date();

    const filteredOrders = allOrders.filter((order) =>
      isOrderWithinDateRange(order, startDate, endDate)
    );

    return {
      period: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
      summary: aggregateSalesSummary(filteredOrders, allProducts),
      orders: filteredOrders,
    };
  },
};
