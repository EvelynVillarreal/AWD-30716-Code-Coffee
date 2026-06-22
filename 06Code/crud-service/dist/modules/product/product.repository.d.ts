export type CreateProductInput = {
    name: string;
    description?: string;
    price: number;
    stock: number;
    status?: string;
    allowsCustomization?: boolean;
    categoryId: number;
};
export type UpdateProductInput = Partial<CreateProductInput>;
export declare const productRepository: {
    findAll: (categoryId?: number) => import(".prisma/client").Prisma.PrismaPromise<({
        category: {
            name: string;
            id: number;
        };
        photos: {
            id: number;
            order: number;
            productId: number;
            url: string;
        }[];
    } & {
        name: string;
        id: number;
        description: string | null;
        price: number;
        stock: number;
        status: string;
        allowsCustomization: boolean;
        categoryId: number;
    })[]>;
    findById: (id: number) => import(".prisma/client").Prisma.Prisma__ProductClient<({
        category: {
            name: string;
            id: number;
        };
        photos: {
            id: number;
            order: number;
            productId: number;
            url: string;
        }[];
    } & {
        name: string;
        id: number;
        description: string | null;
        price: number;
        stock: number;
        status: string;
        allowsCustomization: boolean;
        categoryId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create: (data: CreateProductInput) => import(".prisma/client").Prisma.Prisma__ProductClient<{
        category: {
            name: string;
            id: number;
        };
    } & {
        name: string;
        id: number;
        description: string | null;
        price: number;
        stock: number;
        status: string;
        allowsCustomization: boolean;
        categoryId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update: (id: number, data: UpdateProductInput) => import(".prisma/client").Prisma.Prisma__ProductClient<{
        name: string;
        id: number;
        description: string | null;
        price: number;
        stock: number;
        status: string;
        allowsCustomization: boolean;
        categoryId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateStock: (id: number, stock: number) => import(".prisma/client").Prisma.Prisma__ProductClient<{
        name: string;
        id: number;
        description: string | null;
        price: number;
        stock: number;
        status: string;
        allowsCustomization: boolean;
        categoryId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove: (id: number) => import(".prisma/client").Prisma.Prisma__ProductClient<{
        name: string;
        id: number;
        description: string | null;
        price: number;
        stock: number;
        status: string;
        allowsCustomization: boolean;
        categoryId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
};
//# sourceMappingURL=product.repository.d.ts.map