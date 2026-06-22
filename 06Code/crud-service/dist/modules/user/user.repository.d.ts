import { Prisma } from '@prisma/client';
export type CreateUserInput = {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    address?: string;
    province?: string;
    role?: string;
};
export type UpdateUserInput = Partial<Omit<CreateUserInput, 'email'>>;
export declare const userRepository: {
    findAll: () => Prisma.PrismaPromise<{
        email: string;
        name: string;
        passwordHash: string;
        phone: string | null;
        address: string | null;
        province: string | null;
        role: string;
        id: number;
    }[]>;
    findById: (id: number) => Prisma.Prisma__UserClient<{
        email: string;
        name: string;
        passwordHash: string;
        phone: string | null;
        address: string | null;
        province: string | null;
        role: string;
        id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findByEmail: (email: string) => Prisma.Prisma__UserClient<{
        email: string;
        name: string;
        passwordHash: string;
        phone: string | null;
        address: string | null;
        province: string | null;
        role: string;
        id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create: (data: CreateUserInput) => Prisma.Prisma__UserClient<{
        email: string;
        name: string;
        passwordHash: string;
        phone: string | null;
        address: string | null;
        province: string | null;
        role: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update: (id: number, data: UpdateUserInput) => Prisma.Prisma__UserClient<{
        email: string;
        name: string;
        passwordHash: string;
        phone: string | null;
        address: string | null;
        province: string | null;
        role: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove: (id: number) => Prisma.Prisma__UserClient<{
        email: string;
        name: string;
        passwordHash: string;
        phone: string | null;
        address: string | null;
        province: string | null;
        role: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
};
//# sourceMappingURL=user.repository.d.ts.map