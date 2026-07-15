import {Prisma, JenisKriteria } from "@prisma/client";

export interface SawResult {
  hotelId: number;
  hotelName: string;
  score: number;
  ranking: number;
}
export const calculateSAW = async (
  db: Prisma.TransactionClient,
  kategoriHotelId: number
): Promise<SawResult[]> => {
  // Ambil seluruh hotel beserta nilai kriterianya
 const hotels = await db.hotel.findMany({
  where: {
    kategoriHotelId,
  },
  include: {
    hotelKriterias: {
      include: {
        kriteria: true,
      },
    },
  },
});

  if (!hotels.length) {
    throw new Error("Hotel tidak ditemukan");
  }

  /**
   * =====================================
   * Cari MAX & MIN tiap kriteria
   * =====================================
   */

  const normalisasi: Record<
    number,
    {
      max: number;
      min: number;
      jenis: JenisKriteria;
      bobot: number;
    }
  > = {};

  hotels.forEach((hotel) => {
    hotel.hotelKriterias.forEach((item) => {
      const id = item.kriteriaId;

      if (!normalisasi[id]) {
        normalisasi[id] = {
          max: item.nilai,
          min: item.nilai,
          jenis: item.kriteria.jenis,
          bobot: item.kriteria.bobot,
        };
      } else {
        if (item.nilai > normalisasi[id].max) normalisasi[id].max = item.nilai;

        if (item.nilai < normalisasi[id].min) normalisasi[id].min = item.nilai;
      }
    });
  });

  /**
   * =====================================
   * Hitung Nilai SAW
   * =====================================
   */

  const result: SawResult[] = hotels.map((hotel) => {
    let total = 0;

    hotel.hotelKriterias.forEach((item) => {
      const data = normalisasi[item.kriteriaId];

      let nilaiNormalisasi = 0;

    if (data.jenis === JenisKriteria.BENEFIT) {

  nilaiNormalisasi =
    data.max === 0
      ? 0
      : item.nilai / data.max;

} else {

  nilaiNormalisasi =
    item.nilai === 0
      ? 0
      : data.min / item.nilai;

}

      total += nilaiNormalisasi * data.bobot;
    });

    return {
      hotelId: hotel.id,
      hotelName: hotel.name,
      score: Number(total.toFixed(4)),
      ranking: 0,
    };
  });

  /**
   * =====================================
   * Sorting Ranking
   * =====================================
   */

  result.sort((a, b) => b.score - a.score);

  result.forEach((item, index) => {
    item.ranking = index + 1;
  });

  return result;
};
