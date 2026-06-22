type Order = {
    id: number;
    total: number;
    status: string;
    createdAt: string;
    details: {
        quantity: number;
        unitPrice: number;
    }[];
};
export declare const reportService: {
    getSalesReport: (startDateStr?: string, endDateStr?: string) => Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        summary: {
            totalRevenue: number;
            totalOrders: number;
            averageOrderValue: number;
            statusBreakdown: Record<string, number>;
        };
        orders: Order[];
    }>;
};
export {};
