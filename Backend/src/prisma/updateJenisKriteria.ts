import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    await prisma.kriteria.updateMany({
        where: {
            kode: "C1"
        },
        data: {
            jenis: "COST"
        }
    });

    await prisma.kriteria.updateMany({
        where: {
            kode: "C2"
        },
        data: {
            jenis: "BENEFIT"
        }
    });

    await prisma.kriteria.updateMany({
        where: {
            kode: "C3"
        },
        data: {
            jenis: "COST"
        }
    });

    await prisma.kriteria.updateMany({
        where: {
            kode: "C4"
        },
        data: {
            jenis: "BENEFIT"
        }
    });

    await prisma.kriteria.updateMany({
        where: {
            kode: "C5"
        },
        data: {
            jenis: "BENEFIT"
        }
    });

    await prisma.kriteria.updateMany({
        where: {
            kode: "C6"
        },
        data: {
            jenis: "BENEFIT"
        }
    });

    console.log("Jenis kriteria berhasil diupdate");
}

main()
.finally(async()=>{
    await prisma.$disconnect();
});