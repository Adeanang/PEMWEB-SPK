import { prisma } from "../../config/prisma";
import { calculateSAW } from "./sawServices";

interface RecommendationInput {
  userId: number;
  kategoriHotelId: number;
}

export const generateRecommendation = async ({
  userId,
  kategoriHotelId,
}: RecommendationInput) => {

  // ==========================
  // Hitung SAW DULU
  // ==========================
  const ranking = await calculateSAW(
    prisma,
    kategoriHotelId
  );

  // ==========================
  // Baru simpan ke database
  // ==========================
  return prisma.$transaction(async (tx) => {

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