import prismaClient from '../../shared/prisma/prisma.client';
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

export const userRepository = {
  findAll: () =>
    prismaClient.user.findMany({ orderBy: { id: 'asc' } }),

  findById: (id: number) =>
    prismaClient.user.findUnique({ where: { id } }),

  findByEmail: (email: string) =>
    prismaClient.user.findUnique({ where: { email } }),

  create: (data: CreateUserInput) =>
    prismaClient.user.create({ data }),

  update: (id: number, data: UpdateUserInput) =>
    prismaClient.user.update({ where: { id }, data }),

  remove: (id: number) =>
    prismaClient.user.delete({ where: { id } }),
};
