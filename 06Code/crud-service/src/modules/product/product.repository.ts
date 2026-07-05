import prismaClient from '../../shared/prisma/prisma.client';

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

export const productRepository = {
  findAll: (categoryId?: number) =>
    prismaClient.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true, photos: { orderBy: { order: 'asc' } } },
      orderBy: { id: 'asc' },
    }),

  findById: (id: number) =>
    prismaClient.product.findUnique({
      where: { id },
      include: { category: true, photos: { orderBy: { order: 'asc' } } },
    }),

  create: (data: CreateProductInput) =>
    prismaClient.product.create({
      data,
      include: { category: true },
    }),

  update: (id: number, data: UpdateProductInput) =>
    prismaClient.product.update({ where: { id }, data }),

  updateStock: (id: number, stock: number) =>
    prismaClient.product.update({ where: { id }, data: { stock } }),

  remove: (id: number) =>
    prismaClient.product.delete({ where: { id } }),
};
