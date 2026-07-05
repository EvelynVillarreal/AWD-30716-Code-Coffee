import prismaClient from '../../shared/prisma/prisma.client';

export type CreateCategoryInput = { name: string; isActive?: boolean };
export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export const categoryRepository = {
  findAll: () =>
    prismaClient.category.findMany({ orderBy: { name: 'asc' } }),

  findById: (id: number) =>
    prismaClient.category.findUnique({ where: { id }, include: { products: true } }),

  findByName: (name: string) =>
    prismaClient.category.findUnique({ where: { name } }),

  create: (data: CreateCategoryInput) =>
    prismaClient.category.create({ data }),

  update: (id: number, data: UpdateCategoryInput) =>
    prismaClient.category.update({ where: { id }, data }),

  remove: (id: number) =>
    prismaClient.category.delete({ where: { id } }),
};
