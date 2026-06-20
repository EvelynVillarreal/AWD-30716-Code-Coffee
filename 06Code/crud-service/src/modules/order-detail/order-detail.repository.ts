import prismaClient from '../../shared/prisma/prisma.client';

export type CreateOrderDetailInput = {
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  customizationDetails?: string;
};

export const orderDetailRepository = {
  findByOrderId: (orderId: number) =>
    prismaClient.orderDetail.findMany({
      where: { orderId },
      include: { product: true },
    }),

  findById: (id: number) =>
    prismaClient.orderDetail.findUnique({ where: { id } }),

  create: (data: CreateOrderDetailInput) =>
    prismaClient.orderDetail.create({ data }),

  createMany: (items: CreateOrderDetailInput[]) =>
    prismaClient.orderDetail.createMany({ data: items }),

  remove: (id: number) =>
    prismaClient.orderDetail.delete({ where: { id } }),
};
