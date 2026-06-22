export type CreateShippingConfigInput = {
    baseProvince: string;
    destinationProvince: string;
    additionalCost: number;
};
export declare const shippingConfigRepository: {
    findAll: () => import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        baseProvince: string;
        destinationProvince: string;
        additionalCost: number;
    }[]>;
    findById: (id: number) => import(".prisma/client").Prisma.Prisma__ShippingConfigClient<{
        id: number;
        baseProvince: string;
        destinationProvince: string;
        additionalCost: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findByProvinces: (baseProvince: string, destinationProvince: string) => import(".prisma/client").Prisma.Prisma__ShippingConfigClient<{
        id: number;
        baseProvince: string;
        destinationProvince: string;
        additionalCost: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create: (data: CreateShippingConfigInput) => import(".prisma/client").Prisma.Prisma__ShippingConfigClient<{
        id: number;
        baseProvince: string;
        destinationProvince: string;
        additionalCost: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update: (id: number, data: Partial<CreateShippingConfigInput>) => import(".prisma/client").Prisma.Prisma__ShippingConfigClient<{
        id: number;
        baseProvince: string;
        destinationProvince: string;
        additionalCost: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove: (id: number) => import(".prisma/client").Prisma.Prisma__ShippingConfigClient<{
        id: number;
        baseProvince: string;
        destinationProvince: string;
        additionalCost: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
};
//# sourceMappingURL=shipping-config.repository.d.ts.map