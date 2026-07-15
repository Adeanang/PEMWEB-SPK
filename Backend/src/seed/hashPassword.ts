import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    // Skip kalau password sudah berupa hash bcrypt
    if (user.password.startsWith("$2")) continue;

    const hash = await bcrypt.hash(user.password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hash },
    });

    console.log(`✔ Password ${user.email} berhasil di-hash`);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });

  