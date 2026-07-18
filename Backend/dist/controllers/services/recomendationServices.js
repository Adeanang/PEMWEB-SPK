"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecommendation = void 0;
const prisma_1 = require("../../config/prisma");
const sawServices_1 = require("./sawServices");
const generateRecommendation = async ({ userId, kategoriHotelId, }) => {
    // ==========================
    // Hitung SAW DULU
    // ==========================
    const ranking = await (0, sawServices_1.calculateSAW)(prisma_1.prisma, kategoriHotelId);
    // ==========================
    // Baru simpan ke database
    // ==========================
    return prisma_1.prisma.$transaction(async (tx) => {
        const request = await tx.rekomendasiRequest.create({
            data: {
                userId,
                kategoriHotelId,
            },
        });
        await tx.resultRequest.createMany({
            data: ranking.map((item) => ({
                rekomendasiId: request.id,
                hotelId: item.hotelId,
                score: item.score,
                ranking: item.ranking,
            })),
        });
        const results = await tx.resultRequest.findMany({
            where: {
                rekomendasiId: request.id,
            },
            include: {
                hotel: {
                    include: {
                        kategoriHotel: true,
                    },
                },
            },
            orderBy: {
                ranking: "asc",
            },
        });
        return {
            requestId: request.id,
            results,
        };
    });
};
exports.generateRecommendation = generateRecommendation;
