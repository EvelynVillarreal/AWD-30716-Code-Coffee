import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  let fixedCount = 0;
  for (const user of users) {
    const updated = await prisma.order.updateMany({
      where: {
        contactName: user.name,
        userId: null
      },
      data: {
        userId: user.id
      }
    });
    fixedCount += updated.count;
  }
  console.log(`Fixed ${fixedCount} orders.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
