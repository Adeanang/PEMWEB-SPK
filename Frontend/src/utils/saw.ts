import type { CriteriaKey, Hotel, Kriteria, SAWResult } from "../types/spk";

const CRITERIA_KEYS: CriteriaKey[] = [
  "harga",
  "jarak",
  "rating",
  "fasilitas",
  "kebersihan",
  "pelayanan",
];

/**
 * Menghitung Metode SAW (Simple Additive Weighting):
 * 1. Bentuk matriks keputusan X dari nilai tiap hotel per kriteria.
 * 2. Normalisasi tiap kolom:
 *    - benefit -> rij = xij / max(xij)
 *    - cost    -> rij = min(xij) / xij
 * 3. Kalikan hasil normalisasi dengan bobot kriteria (wj, dinormalisasi ke 1).
 * 4. Jumlahkan tiap baris menjadi nilai preferensi Vi.
 * 5. Urutkan Vi secara menurun untuk mendapatkan perankingan.
 */
export function computeSAW(hotelList: Hotel[], kriteriaList: Kriteria[]): SAWResult[] {
  if (hotelList.length === 0) return [];

  // Normalisasi total bobot menjadi 1 (mis. jika user mengubah bobot manual
  // dan totalnya tidak tepat 100%, tetap proporsional).
  const totalBobot = kriteriaList.reduce((sum, k) => sum + k.bobot, 0) || 1;
  const bobotMap: Record<CriteriaKey, number> = {} as Record<CriteriaKey, number>;
  const tipeMap: Record<CriteriaKey, "benefit" | "cost"> = {} as Record<
    CriteriaKey,
    "benefit" | "cost"
  >;
  kriteriaList.forEach((k) => {
    bobotMap[k.key] = k.bobot / totalBobot;
    tipeMap[k.key] = k.tipe;
  });

  // Cari nilai max & min tiap kriteria di antara hotel yang dibandingkan
  const maxVal: Record<CriteriaKey, number> = {} as Record<CriteriaKey, number>;
  const minVal: Record<CriteriaKey, number> = {} as Record<CriteriaKey, number>;
  CRITERIA_KEYS.forEach((key) => {
    const values = hotelList.map((h) => h.nilai[key]);
    maxVal[key] = Math.max(...values);
    minVal[key] = Math.min(...values);
  });

  const results: SAWResult[] = hotelList.map((hotel) => {
    const normalisasi = {} as Record<CriteriaKey, number>;
    const terbobot = {} as Record<CriteriaKey, number>;
    let score = 0;

    CRITERIA_KEYS.forEach((key) => {
      const x = hotel.nilai[key];
      let r = 0;

      if (tipeMap[key] === "benefit") {
        r = maxVal[key] === 0 ? 0 : x / maxVal[key];
      } else {
        // cost — hindari pembagian dengan nol
        r = x === 0 ? 0 : minVal[key] / x;
      }

      normalisasi[key] = r;
      const w = (bobotMap[key] ?? 0) * r;
      terbobot[key] = w;
      score += w;
    });

    return {
      hotel,
      normalisasi,
      terbobot,
      score,
      ranking: 0, // diisi setelah diurutkan
    };
  });

  results.sort((a, b) => b.score - a.score);
  results.forEach((r, idx) => {
    r.ranking = idx + 1;
  });

  return results;
}

export { CRITERIA_KEYS };
