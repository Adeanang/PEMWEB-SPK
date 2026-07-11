import type {
  User,
  KategoriHotel,
  Kriteria,
  Hotel,
  SubKriteria,
} from "../types/spk";

// ------------------------------------------------------------------
// Tabel: User
// ------------------------------------------------------------------
export const users: User[] = [
  { id: 1, email: "adeanang@gmail.com", password: "anang1234", role: "super admin" },
  { id: 2, email: "kurniawan@gmail.com", password: "kurni1234", role: "admin" },
  { id: 3, email: "wawanpride@gmail.com", password: "wawan1234", role: "user" },
  { id: 4, email: "gunawan1234@gmail.com", password: "gunawan123", role: "admin" },
];

// ------------------------------------------------------------------
// Tabel: kategori_hotel
// ------------------------------------------------------------------
export const kategoriHotelList: KategoriHotel[] = [
  { id: 1, nama_kategori: "Bintang 1" },
  { id: 2, nama_kategori: "Bintang 2" },
  { id: 3, nama_kategori: "Bintang 3" },
  { id: 4, nama_kategori: "Bintang 4" },
  { id: 5, nama_kategori: "Bintang 5" },
];

// ------------------------------------------------------------------
// Tabel: kriteria (+ pemetaan ke key numerik untuk perhitungan SAW)
// bobot default mengikuti data yang diberikan: 30/20/15/15/10/10 = 100%
// tipe cost -> semakin kecil nilainya semakin baik (harga, jarak)
// tipe benefit -> semakin besar nilainya semakin baik
// ------------------------------------------------------------------
export const defaultKriteria: Kriteria[] = [
  { id_kriteria: 1, kode: "C1", nama: "Harga", key: "harga", tipe: "cost", bobot: 30 },
  { id_kriteria: 2, kode: "C2", nama: "Jarak", key: "jarak", tipe: "cost", bobot: 20 },
  { id_kriteria: 3, kode: "C3", nama: "Rating", key: "rating", tipe: "benefit", bobot: 15 },
  { id_kriteria: 4, kode: "C4", nama: "Fasilitas", key: "fasilitas", tipe: "benefit", bobot: 15 },
  { id_kriteria: 5, kode: "C5", nama: "Kebersihan", key: "kebersihan", tipe: "benefit", bobot: 10 },
  { id_kriteria: 6, kode: "C6", nama: "Pelayanan", key: "pelayanan", tipe: "benefit", bobot: 10 },
];

// ------------------------------------------------------------------
// Tabel: sub_kriteria (rentang harga)
// ------------------------------------------------------------------
export const subKriteriaHarga: SubKriteria[] = [
  { id_sub: 1, kriteria_id: 1, value: "Sangat Mahal (> Rp500.000)", min: 500000, max: Infinity },
  { id_sub: 2, kriteria_id: 1, value: "Mahal (Rp350.000 - Rp500.000)", min: 350000, max: 500000 },
  { id_sub: 3, kriteria_id: 1, value: "Sedang (Rp250.000 - Rp350.000)", min: 250000, max: 350000 },
  { id_sub: 4, kriteria_id: 1, value: "Murah (< Rp250.000)", min: 0, max: 250000 },
];

// ------------------------------------------------------------------
// Tabel: Hotel (digabung dengan Fasilitas_hotel & nilai kriteria hasil
// survei/administrasi, dipakai sebagai matriks keputusan pada SAW)
// ------------------------------------------------------------------
export const hotels: Hotel[] = [
  {
    id: 1,
    name: "Plaza Hotel",
    location: "Kota Tegal",
    sosial_media: "plaza_hotel",
    image_hotel:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    id_user: 2,
    lat: -6.8696186978902400,
    lng: 109.11766146500600,
    id_kategori_hotel: 4,
    nilai: {
      harga: 400000,
      jarak: 1.2,
      rating: 4.5,
      fasilitas: 3,
      kebersihan: 4.4,
      pelayanan: 4.3,
    },
    fasilitas_list: ["Meeting Room", "Kolam Renang", "Breakfast"],
  },
  {
    id: 2,
    name: "Bahari Inn",
    location: "Kota Tegal",
    sosial_media: "bahari_inn",
    image_hotel:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    id_user: 4,
    id_kategori_hotel: 5,
    nilai: {
      harga: 480000,
      jarak: 2.5,
      rating: 4.7,
      fasilitas: 5,
      kebersihan: 4.7,
      pelayanan: 4.6,
    },
    fasilitas_list: ["Kolam Renang", "Spa", "Breakfast", "Wifi Gratis", "Parkir Luas"],
  },
  {
    id: 3,
    name: "Tegal Heritage Hotel",
    location: "Kota Tegal",
    sosial_media: "tegal_heritage",
    image_hotel:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    id_user: 2,
    id_kategori_hotel: 3,
    nilai: {
      harga: 300000,
      jarak: 0.8,
      rating: 4.2,
      fasilitas: 2,
      kebersihan: 4.0,
      pelayanan: 4.1,
    },
    fasilitas_list: ["Wifi Gratis", "Breakfast"],
  },
  {
    id: 4,
    name: "Guci Mountain Resort",
    location: "Kabupaten Tegal",
    sosial_media: "guci_mountain_resort",
    image_hotel:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    id_user: 4,
    id_kategori_hotel: 4,
    nilai: {
      harga: 550000,
      jarak: 12.5,
      rating: 4.8,
      fasilitas: 4,
      kebersihan: 4.6,
      pelayanan: 4.7,
    },
    fasilitas_list: ["Pemandian Air Panas", "Restoran", "Area Camping", "Wifi Gratis"],
  },
  {
    id: 5,
    name: "Kota Lama Inn",
    location: "Kota Tegal",
    sosial_media: "kota_lama_inn",
    image_hotel:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80",
    id_user: 2,
    id_kategori_hotel: 2,
    nilai: {
      harga: 200000,
      jarak: 1.8,
      rating: 3.9,
      fasilitas: 2,
      kebersihan: 3.8,
      pelayanan: 3.9,
    },
    fasilitas_list: ["Wifi Gratis", "Parkir"],
  },
  {
    id: 6,
    name: "Karlita International Hotel",
    location: "Kota Tegal",
    sosial_media: "karlita_hotel",
    image_hotel:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
    id_user: 4,
    id_kategori_hotel: 5,
    nilai: {
      harga: 650000,
      jarak: 3.4,
      rating: 4.6,
      fasilitas: 5,
      kebersihan: 4.8,
      pelayanan: 4.5,
    },
    fasilitas_list: ["Kolam Renang", "Meeting Room", "Spa", "Restoran", "Gym"],
  },
];
