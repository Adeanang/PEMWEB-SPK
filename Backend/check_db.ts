import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Users:', await prisma.user.count());
  console.log('Hotels:', await prisma.hotel.count());
}

main().finally(() => prisma.$disconnect());
