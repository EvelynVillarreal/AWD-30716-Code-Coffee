import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({
  log: ['error', 'warn'],
});

export default prismaClient;
