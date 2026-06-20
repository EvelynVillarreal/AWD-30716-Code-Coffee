import prismaClient from '../../shared/prisma/prisma.client';

export type CreateShippingConfigInput = {
  baseProvince: string;
  destinationProvince: string;
  additionalCost: number;
};

export const shippingConfigRepository = {
  findAll: () =>
    prismaClient.shippingConfig.findMany({ orderBy: { baseProvince: 'asc' } }),

  findById: (id: number) =>
    prismaClient.shippingConfig.findUnique({ where: { id } }),

  findByProvinces: (baseProvince: string, destinationProvince: string) =>
    prismaClient.shippingConfig.findUnique({
      where: { baseProvince_destinationProvince: { baseProvince, destinationProvince } },
    }),

  create: (data: CreateShippingConfigInput) =>
    prismaClient.shippingConfig.create({ data }),

  update: (id: number, data: Partial<CreateShippingConfigInput>) =>
    prismaClient.shippingConfig.update({ where: { id }, data }),

  remove: (id: number) =>
    prismaClient.shippingConfig.delete({ where: { id } }),
};
