export type CreateCategoryInput = {
    name: string;
};
export type UpdateCategoryInput = Partial<CreateCategoryInput>;
export declare const categoryRepository: {
    findAll: () => import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
    }[]>;
    findById: (id: number) => import(".prisma/client").Prisma.Prisma__CategoryClient<({
        products: {
            name: string;
            id: number;
            description: string | null;
            price: number;
            stock: number;
            status: string;
            allowsCustomization: boolean;
            categoryId: number;
        }[];
    } & {
        name: string;
        id: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findByName: (name: string) => import(".prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create: (data: CreateCategoryInput) => import(".prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update: (id: number, data: UpdateCategoryInput) => import(".prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove: (id: number) => import(".prisma/client").Prisma.Prisma__CategoryClient<{
        name: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
};
//# sourceMappingURL=category.repository.d.ts.map