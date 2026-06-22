export type CreateProductPhotoInput = {
    productId: number;
    url: string;
    order?: number;
};
export declare const productPhotoRepository: {
    findByProductId: (productId: number) => import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        order: number;
        productId: number;
        url: string;
    }[]>;
    findById: (id: number) => import(".prisma/client").Prisma.Prisma__ProductPhotoClient<{
        id: number;
        order: number;
        productId: number;
        url: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create: (data: CreateProductPhotoInput) => import(".prisma/client").Prisma.Prisma__ProductPhotoClient<{
        id: number;
        order: number;
        productId: number;
        url: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove: (id: number) => import(".prisma/client").Prisma.Prisma__ProductPhotoClient<{
        id: number;
        order: number;
        productId: number;
        url: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    removeAllByProductId: (productId: number) => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
};
//# sourceMappingURL=product-photo.repository.d.ts.map