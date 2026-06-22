export type CreateOrderInput = {
    referenceNumber: string;
    userId?: number;
    contactName: string;
    email: string;
    phone: string;
    address: string;
    province: string;
    shippingCost: number;
    total: number;
    status?: string;
    isCustomized?: boolean;
};
export type UpdateOrderStatusInput = {
    status: string;
};
export declare const orderRepository: {
    findAll: () => import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            email: string;
            name: string;
            passwordHash: string;
            phone: string | null;
            address: string | null;
            province: string | null;
            role: string;
            id: number;
        } | null;
        details: {
            id: number;
            productId: number;
            orderId: number;
            quantity: number;
            unitPrice: number;
            customizationDetails: string | null;
        }[];
        statusHistory: {
            id: number;
            status: string;
            date: Date;
            orderId: number;
        }[];
    } & {
        email: string;
        phone: string;
        address: string;
        province: string;
        id: number;
        status: string;
        referenceNumber: string;
        userId: number | null;
        contactName: string;
        shippingCost: number;
        total: number;
        isCustomized: boolean;
        createdAt: Date;
    })[]>;
    findById: (id: number) => import(".prisma/client").Prisma.Prisma__OrderClient<({
        user: {
            email: string;
            name: string;
            passwordHash: string;
            phone: string | null;
            address: string | null;
            province: string | null;
            role: string;
            id: number;
        } | null;
        details: ({
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
        })[];
        statusHistory: {
            id: number;
            status: string;
            date: Date;
            orderId: number;
        }[];
    } & {
        email: string;
        phone: string;
        address: string;
        province: string;
        id: number;
        status: string;
        referenceNumber: string;
        userId: number | null;
        contactName: string;
        shippingCost: number;
        total: number;
        isCustomized: boolean;
        createdAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findByReferenceNumber: (referenceNumber: string) => import(".prisma/client").Prisma.Prisma__OrderClient<({
        details: {
            id: number;
            productId: number;
            orderId: number;
            quantity: number;
            unitPrice: number;
            customizationDetails: string | null;
        }[];
        statusHistory: {
            id: number;
            status: string;
            date: Date;
            orderId: number;
        }[];
    } & {
        email: string;
        phone: string;
        address: string;
        province: string;
        id: number;
        status: string;
        referenceNumber: string;
        userId: number | null;
        contactName: string;
        shippingCost: number;
        total: number;
        isCustomized: boolean;
        createdAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findByUserId: (userId: number) => import(".prisma/client").Prisma.PrismaPromise<({
        details: {
            id: number;
            productId: number;
            orderId: number;
            quantity: number;
            unitPrice: number;
            customizationDetails: string | null;
        }[];
        statusHistory: {
            id: number;
            status: string;
            date: Date;
            orderId: number;
        }[];
    } & {
        email: string;
        phone: string;
        address: string;
        province: string;
        id: number;
        status: string;
        referenceNumber: string;
        userId: number | null;
        contactName: string;
        shippingCost: number;
        total: number;
        isCustomized: boolean;
        createdAt: Date;
    })[]>;
    create: (data: CreateOrderInput) => import(".prisma/client").Prisma.Prisma__OrderClient<{
        email: string;
        phone: string;
        address: string;
        province: string;
        id: number;
        status: string;
        referenceNumber: string;
        userId: number | null;
        contactName: string;
        shippingCost: number;
        total: number;
        isCustomized: boolean;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateStatus: (id: number, status: string) => import(".prisma/client").Prisma.Prisma__OrderClient<{
        email: string;
        phone: string;
        address: string;
        province: string;
        id: number;
        status: string;
        referenceNumber: string;
        userId: number | null;
        contactName: string;
        shippingCost: number;
        total: number;
        isCustomized: boolean;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove: (id: number) => import(".prisma/client").Prisma.Prisma__OrderClient<{
        email: string;
        phone: string;
        address: string;
        province: string;
        id: number;
        status: string;
        referenceNumber: string;
        userId: number | null;
        contactName: string;
        shippingCost: number;
        total: number;
        isCustomized: boolean;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
};
//# sourceMappingURL=order.repository.d.ts.map