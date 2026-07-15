import { prisma } from "../../config/prisma";

interface ComparisonInput {
  kriteria1Id: number;
  kriteria2Id: number;
  nilai: number;
}

export const savePerbandingan = async (
  rekomendasiId: number,
  comparisons: ComparisonInput[]
) => {

  // hapus data lama
  await prisma.perbandinganKriteria.deleteMany({
    where: {
      rekomendasiId,
    },
  });

  // simpan data baru
  await prisma.perbandinganKriteria.createMany({
    data: comparisons.map((item) => ({
      rekomendasiId,
      kriteria1Id: item.kriteria1Id,
      kriteria2Id: item.kriteria2Id,
      nilai: item.nilai,
    })),
  });

  return true;
};