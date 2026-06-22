export type CreateOrderDetailInput = {
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    customizationDetails?: string;
};
export declare const orderDetailRepository: {
    findByOrderId: (orderId: number) => import(".prisma/client").Prisma.PrismaPromise<({
        product: {
            name: string;
            id: number;
            description: string | null;
            price: number;
            stock: number;
            status: string;
            allowsCustomization: boolean;
            categoryId: number;
        };
    } & {
        id: number;
        productId: number;
        orderId: number;
        quantity: number;
        unitPrice: number;
        customizationDetails: string | null;
    })[]>;
    findById: (id: number) => import(".prisma/client").Prisma.Prisma__OrderDetailClient<{
        id: number;
        productId: number;
        orderId: number;
        quantity: number;
        unitPrice: number;
        customizationDetails: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create: (data: CreateOrderDetailInput) => import(".prisma/client").Prisma.Prisma__OrderDetailClient<{
        id: number;
        productId: number;
        orderId: number;
        quantity: number;
        unitPrice: number;
        customizationDetails: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createMany: (items: CreateOrderDetailInput[]) => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    remove: (id: number) => import(".prisma/client").Prisma.Prisma__OrderDetailClient<{
        id: number;
        productId: number;
        orderId: number;
        quantity: number;
        unitPrice: number;
        customizationDetails: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
};
//# sourceMappingURL=order-detail.repository.d.ts.map