"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePerbandingan = void 0;
const prisma_1 = require("../../config/prisma");
const savePerbandingan = async (rekomendasiId, comparisons) => {
    // hapus data lama
    await prisma_1.prisma.perbandinganKriteria.deleteMany({
        where: {
            rekomendasiId,
        },
    });
    // simpan data baru
    await prisma_1.prisma.perbandinganKriteria.createMany({
        data: comparisons.map((item) => ({
            rekomendasiId,
            kriteria1Id: item.kriteria1Id,
            kriteria2Id: item.kriteria2Id,
            nilai: item.nilai,
        })),
    });
    return true;
};
exports.savePerbandingan = savePerbandingan;
