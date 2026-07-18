import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.hotel.findMany({
    include: {
      hotelKriterias: {
        include: { kriteria: true }
      }
    }
  });
  console.log(JSON.stringify(hotels[0], null, 2));
}

main().finally(() => prisma.$disconnect());
