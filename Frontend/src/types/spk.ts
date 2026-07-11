// ==========================================================================
// Tipe data yang merepresentasikan skema database Sistem Pendukung Keputusan
// (SPK) Rekomendasi Hotel — metode Simple Additive Weighting (SAW)
// ==========================================================================

export interface User {
  id: number;
  email: string;
  password: string;
  role: "super admin" | "admin" | "user";
}

export interface KategoriHotel {
  id: number;
  nama_kategori: string; // Bintang 1 - Bintang 5
}

export interface FasilitasHotel {
  id_fasilitas: number;
  id_hotel: number;
  fasilitas: string;
}

export interface KategoriKamar {
  id_kamar: number;
  id_hotel: number;
  nama_kategori: string;
  deskripsi: string;
  kapasitas_orang: string;
}

export interface Kamar {
  id_kamar: number;
  id_hotel: number;
  id_kategori: number;
  nomor_kamar: string;
}

// Kunci kriteria yang dipakai pada perhitungan SAW. Nama field ini sengaja
// disamakan dengan kode kriteria (C1..C6) pada tabel `kriteria`.
export type CriteriaKey =
  | "harga"
  | "jarak"
  | "rating"
  | "fasilitas"
  | "kebersihan"
  | "pelayanan";

export type CriteriaType = "benefit" | "cost";

export interface Kriteria {
  id_kriteria: number;
  kode: string; // C1..C6
  nama: string;
  key: CriteriaKey;
  tipe: CriteriaType; // benefit = semakin besar semakin baik, cost = sebaliknya
  bobot: number; // persentase 0-100, default sesuai tabel kriteria
}

export interface SubKriteria {
  id_sub: number;
  kriteria_id: number;
  value: string;
  min?: number; // batas bawah rentang (opsional, untuk filter harga)
  max?: number; // batas atas rentang (opsional, untuk filter harga)
}

// Nilai riil per kriteria untuk tiap hotel (dipakai sebagai matriks
// keputusan / matriks X pada perhitungan SAW).
export interface NilaiKriteriaHotel {
  harga: number; // rata-rata harga kamar per malam (Rp)
  jarak: number; // jarak dari pusat kota/titik wisata (km)
  rating: number; // rating ulasan (1-5)
  fasilitas: number; // jumlah fasilitas yang tersedia
  kebersihan: number; // skor kebersihan (1-5)
  pelayanan: number; // skor pelayanan (1-5)
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  sosial_media: string;
  image_hotel: string;
  id_user: number;
  lat?: number;
  lng?: number;
  id_kategori_hotel: number;
  nilai: NilaiKriteriaHotel;
  fasilitas_list: string[];
}

export interface RekomendasiRequest {
  id_rekomendasi: number;
  user_id: number | null;
  kategori_hotel_id: number | null;
  created_at: string;
}

export interface RekomendasiReqKriteria {
  id_req: number;
  id_rekomendasi: number;
  kriteria_id: number;
  bobot: number;
}

export interface ResultRequest {
  id_result: number;
  id_rekomendasi: number;
  id_hotel: number;
  score: number;
  ranking: number;
}

// ---------------------------------------------------------------------
// Hasil perhitungan SAW yang ditampilkan di frontend
// ---------------------------------------------------------------------
export interface SAWResult {
  hotel: Hotel;
  normalisasi: Record<CriteriaKey, number>; // matriks R (ternormalisasi)
  terbobot: Record<CriteriaKey, number>; // R x bobot
  score: number; // total nilai preferensi (Vi)
  ranking: number;
}
