import prismaClient from '../../shared/prisma/prisma.client';

export type CreateStatusHistoryInput = {
  orderId: number;
  status: string;
};

export const orderStatusHistoryRepository = {
  findByOrderId: (orderId: number) =>
    prismaClient.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { date: 'asc' },
    }),

  create: (data: CreateStatusHistoryInput) =>
    prismaClient.orderStatusHistory.create({ data }),
};
