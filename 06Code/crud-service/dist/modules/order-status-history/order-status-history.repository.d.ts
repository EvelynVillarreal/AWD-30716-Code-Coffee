export type CreateStatusHistoryInput = {
    orderId: number;
    status: string;
};
export declare const orderStatusHistoryRepository: {
    findByOrderId: (orderId: number) => import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        status: string;
        date: Date;
        orderId: number;
    }[]>;
    create: (data: CreateStatusHistoryInput) => import(".prisma/client").Prisma.Prisma__OrderStatusHistoryClient<{
        id: number;
        status: string;
        date: Date;
        orderId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
};
//# sourceMappingURL=order-status-history.repository.d.ts.map