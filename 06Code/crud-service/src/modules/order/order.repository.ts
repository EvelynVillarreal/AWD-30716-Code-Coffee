import prismaClient from '../../shared/prisma/prisma.client';

export type CreateOrderInput = {
  referenceNumber: string;
  userId?: number;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  shippingCost: number;
  total: number;
  status?: string;
  isCustomized?: boolean;
};

export type UpdateOrderStatusInput = { status: string };

export const orderRepository = {
  findAll: () =>
    prismaClient.order.findMany({
      include: { details: true, statusHistory: true, user: true },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: number) =>
    prismaClient.order.findUnique({
      where: { id },
      include: {
        details: { include: { product: true } },
        statusHistory: { orderBy: { date: 'asc' } },
        user: true,
      },
    }),

  findByReferenceNumber: (referenceNumber: string) =>
    prismaClient.order.findUnique({
      where: { referenceNumber },
      include: { details: true, statusHistory: true },
    }),

  findByUserId: (userId: number) =>
    prismaClient.order.findMany({
      where: { userId },
      include: { details: true, statusHistory: true },
      orderBy: { createdAt: 'desc' },
    }),

  create: (data: CreateOrderInput) =>
    prismaClient.order.create({ data }),

  updateStatus: (id: number, status: string) =>
    prismaClient.order.update({ where: { id }, data: { status } }),

  remove: (id: number) =>
    prismaClient.order.delete({ where: { id } }),
};
