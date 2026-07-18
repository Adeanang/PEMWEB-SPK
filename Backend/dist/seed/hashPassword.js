"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const users = await prisma.user.findMany();
    for (const user of users) {
        // Skip kalau password sudah berupa hash bcrypt
        if (user.password.startsWith("$2"))
            continue;
        const hash = await bcrypt_1.default.hash(user.password, 10);
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
