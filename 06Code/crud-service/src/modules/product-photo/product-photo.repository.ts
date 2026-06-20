import prismaClient from '../../shared/prisma/prisma.client';

export type CreateProductPhotoInput = {
  productId: number;
  url: string;
  order?: number;
};

export const productPhotoRepository = {
  findByProductId: (productId: number) =>
    prismaClient.productPhoto.findMany({
      where: { productId },
      orderBy: { order: 'asc' },
    }),

  findById: (id: number) =>
    prismaClient.productPhoto.findUnique({ where: { id } }),

  create: (data: CreateProductPhotoInput) =>
    prismaClient.productPhoto.create({ data }),

  remove: (id: number) =>
    prismaClient.productPhoto.delete({ where: { id } }),

  removeAllByProductId: (productId: number) =>
    prismaClient.productPhoto.deleteMany({ where: { productId } }),
};
