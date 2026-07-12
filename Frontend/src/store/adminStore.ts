import { create } from 'zustand';
import {
  hotels as initialHotels,
  users as initialUsers,
  kategoriHotelList as initialKategori,
  defaultKriteria as initialKriteria,
  subKriteriaHarga as initialSubKriteriaHarga,
} from '../data/spkData';
import type { Hotel, User, KategoriHotel, Kriteria } from '../types/spk';

export interface AdminSubKriteria {
  id: number;
  kriteriaId: number;
  value: string;
  skor: number;
}

export interface KategoriKamar {
  id: number;
  hotelId: number;
  namaKategori: string;
  deskripsi: string;
  kapasitasOrang: string;
}

export interface Kamar {
  id: number;
  hotelId: number;
  kategoriId: number;
  nomorKamar: string;
}

export interface FasilitasHotel {
  id: number;
  hotelId: number;
  fasilitas: string;
}

export interface HotelKriteria {
  id: number;
  hotelId: number;
  kriteriaId: number;
  nilai: number;
}

export interface PerbandinganKriteria {
  id: number;
  kriteria1Id: number;
  kriteria2Id: number;
  nilai: number;
}

export interface RekomendasiRequest {
  id: number;
  userId: number | null;
  kategoriHotelId: number | null;
  createdAt: string;
}


const criteriaKeyToId: Record<string, number> = {
  harga: 1, jarak: 2, rating: 3, fasilitas: 4, kebersihan: 5, pelayanan: 6,
};

function genHotelKriterias(): HotelKriteria[] {
  const result: HotelKriteria[] = [];
  let id = 1;
  initialHotels.forEach((hotel) => {
    Object.entries(hotel.nilai).forEach(([key, nilai]) => {
      const kriteriaId = criteriaKeyToId[key];
      if (kriteriaId) result.push({ id: id++, hotelId: hotel.id, kriteriaId, nilai: nilai as number });
    });
  });
  return result;
}

function genFasilitas(): FasilitasHotel[] {
  const result: FasilitasHotel[] = [];
  let id = 1;
  initialHotels.forEach((h) => h.fasilitas_list.forEach((f) => result.push({ id: id++, hotelId: h.id, fasilitas: f })));
  return result;
}


const initialSubKriterias: AdminSubKriteria[] = initialSubKriteriaHarga.map((s, i) => ({
  id: i + 1,
  kriteriaId: s.kriteria_id,
  value: s.value,
  skor: 4 - i,
}));

const initialKategoriKamars: KategoriKamar[] = [
  { id: 1, hotelId: 1, namaKategori: 'Deluxe', deskripsi: 'Kamar deluxe dengan pemandangan kota', kapasitasOrang: '2' },
  { id: 2, hotelId: 1, namaKategori: 'Suite', deskripsi: 'Kamar suite premium dengan ruang tamu', kapasitasOrang: '3' },
  { id: 3, hotelId: 2, namaKategori: 'Standard', deskripsi: 'Kamar standar nyaman dan bersih', kapasitasOrang: '2' },
  { id: 4, hotelId: 2, namaKategori: 'Junior Suite', deskripsi: 'Junior suite dengan fasilitas lengkap', kapasitasOrang: '2' },
  { id: 5, hotelId: 3, namaKategori: 'Standard', deskripsi: 'Kamar standar dengan desain heritage', kapasitasOrang: '2' },
];

const initialKamars: Kamar[] = [
  { id: 1, hotelId: 1, kategoriId: 1, nomorKamar: '101' },
  { id: 2, hotelId: 1, kategoriId: 1, nomorKamar: '102' },
  { id: 3, hotelId: 1, kategoriId: 2, nomorKamar: '201' },
  { id: 4, hotelId: 2, kategoriId: 3, nomorKamar: '101' },
  { id: 5, hotelId: 2, kategoriId: 3, nomorKamar: '102' },
  { id: 6, hotelId: 2, kategoriId: 4, nomorKamar: '201' },
  { id: 7, hotelId: 3, kategoriId: 5, nomorKamar: '101' },
];

const initialRekomendasiRequests: RekomendasiRequest[] = [
  { id: 1, userId: 3, kategoriHotelId: 4, createdAt: '2025-06-01T08:30:00Z' },
  { id: 2, userId: null, kategoriHotelId: 3, createdAt: '2025-06-05T10:15:00Z' },
  { id: 3, userId: 3, kategoriHotelId: 5, createdAt: '2025-06-10T14:00:00Z' },
  { id: 4, userId: null, kategoriHotelId: 2, createdAt: '2025-06-15T09:45:00Z' },
  { id: 5, userId: 3, kategoriHotelId: 4, createdAt: '2025-06-20T11:30:00Z' },
  { id: 6, userId: null, kategoriHotelId: 3, createdAt: '2025-07-01T13:00:00Z' },
  { id: 7, userId: 3, kategoriHotelId: 5, createdAt: '2025-07-05T16:00:00Z' },
];


const nextId = {
  hotel: Math.max(...initialHotels.map((h) => h.id)) + 1,
  user: Math.max(...initialUsers.map((u) => u.id)) + 1,
  kategoriHotel: Math.max(...initialKategori.map((k) => k.id)) + 1,
  kriteria: Math.max(...initialKriteria.map((k) => k.id_kriteria)) + 1,
  subKriteria: initialSubKriterias.length + 1,
  kategoriKamar: initialKategoriKamars.length + 1,
  kamar: initialKamars.length + 1,
  fasilitas: genFasilitas().length + 1,
  hotelKriteria: genHotelKriterias().length + 1,
  perbandingan: 1,
  rekomendasi: initialRekomendasiRequests.length + 1,
};


interface AdminStore {
  hotels: Hotel[];
  users: User[];
  kategoriHotels: KategoriHotel[];
  kriterias: Kriteria[];
  subKriterias: AdminSubKriteria[];
  kategoriKamars: KategoriKamar[];
  kamars: Kamar[];
  fasilitasHotels: FasilitasHotel[];
  hotelKriterias: HotelKriteria[];
  perbandinganKriterias: PerbandinganKriteria[];
  rekomendasiRequests: RekomendasiRequest[];

  // Hotel CRUD
  addHotel: (h: Omit<Hotel, 'id'>) => void;
  updateHotel: (id: number, h: Partial<Hotel>) => void;
  deleteHotel: (id: number) => void;

  // User CRUD
  addUser: (u: Omit<User, 'id'>) => void;
  updateUser: (id: number, u: Partial<User>) => void;
  deleteUser: (id: number) => void;

  // KategoriHotel CRUD
  addKategoriHotel: (k: Omit<KategoriHotel, 'id'>) => void;
  updateKategoriHotel: (id: number, k: Partial<KategoriHotel>) => void;
  deleteKategoriHotel: (id: number) => void;

  // Kriteria CRUD
  addKriteria: (k: Omit<Kriteria, 'id_kriteria'>) => void;
  updateKriteria: (id: number, k: Partial<Kriteria>) => void;
  deleteKriteria: (id: number) => void;

  // SubKriteria CRUD
  addSubKriteria: (s: Omit<AdminSubKriteria, 'id'>) => void;
  updateSubKriteria: (id: number, s: Partial<AdminSubKriteria>) => void;
  deleteSubKriteria: (id: number) => void;

  // KategoriKamar CRUD
  addKategoriKamar: (k: Omit<KategoriKamar, 'id'>) => void;
  updateKategoriKamar: (id: number, k: Partial<KategoriKamar>) => void;
  deleteKategoriKamar: (id: number) => void;

  // Kamar CRUD
  addKamar: (k: Omit<Kamar, 'id'>) => void;
  updateKamar: (id: number, k: Partial<Kamar>) => void;
  deleteKamar: (id: number) => void;

  // FasilitasHotel CRUD
  addFasilitas: (f: Omit<FasilitasHotel, 'id'>) => void;
  updateFasilitas: (id: number, f: Partial<FasilitasHotel>) => void;
  deleteFasilitas: (id: number) => void;

  // HotelKriteria CRUD
  addHotelKriteria: (hk: Omit<HotelKriteria, 'id'>) => void;
  updateHotelKriteria: (id: number, hk: Partial<HotelKriteria>) => void;
  deleteHotelKriteria: (id: number) => void;

  // PerbandinganKriteria CRUD
  addPerbandingan: (p: Omit<PerbandinganKriteria, 'id'>) => void;
  updatePerbandingan: (id: number, p: Partial<PerbandinganKriteria>) => void;
  deletePerbandingan: (id: number) => void;
}


export const useAdminStore = create<AdminStore>((set) => ({
  hotels: [...initialHotels],
  users: [...initialUsers],
  kategoriHotels: [...initialKategori],
  kriterias: [...initialKriteria],
  subKriterias: [...initialSubKriterias],
  kategoriKamars: [...initialKategoriKamars],
  kamars: [...initialKamars],
  fasilitasHotels: genFasilitas(),
  hotelKriterias: genHotelKriterias(),
  perbandinganKriterias: [],
  rekomendasiRequests: [...initialRekomendasiRequests],

  // Hotel
  addHotel: (h) => set((s) => ({ hotels: [...s.hotels, { ...h, id: nextId.hotel++ }] })),
  updateHotel: (id, h) => set((s) => ({ hotels: s.hotels.map((x) => (x.id === id ? { ...x, ...h } : x)) })),
  deleteHotel: (id) => set((s) => ({ hotels: s.hotels.filter((x) => x.id !== id) })),

  // User
  addUser: (u) => set((s) => ({ users: [...s.users, { ...u, id: nextId.user++ }] })),
  updateUser: (id, u) => set((s) => ({ users: s.users.map((x) => (x.id === id ? { ...x, ...u } : x)) })),
  deleteUser: (id) => set((s) => ({ users: s.users.filter((x) => x.id !== id) })),

  // KategoriHotel
  addKategoriHotel: (k) => set((s) => ({ kategoriHotels: [...s.kategoriHotels, { ...k, id: nextId.kategoriHotel++ }] })),
  updateKategoriHotel: (id, k) => set((s) => ({ kategoriHotels: s.kategoriHotels.map((x) => (x.id === id ? { ...x, ...k } : x)) })),
  deleteKategoriHotel: (id) => set((s) => ({ kategoriHotels: s.kategoriHotels.filter((x) => x.id !== id) })),

  // Kriteria
  addKriteria: (k) => set((s) => ({ kriterias: [...s.kriterias, { ...k, id_kriteria: nextId.kriteria++ }] })),
  updateKriteria: (id, k) => set((s) => ({ kriterias: s.kriterias.map((x) => (x.id_kriteria === id ? { ...x, ...k } : x)) })),
  deleteKriteria: (id) => set((s) => ({ kriterias: s.kriterias.filter((x) => x.id_kriteria !== id) })),

  // SubKriteria
  addSubKriteria: (sv) => set((s) => ({ subKriterias: [...s.subKriterias, { ...sv, id: nextId.subKriteria++ }] })),
  updateSubKriteria: (id, sv) => set((s) => ({ subKriterias: s.subKriterias.map((x) => (x.id === id ? { ...x, ...sv } : x)) })),
  deleteSubKriteria: (id) => set((s) => ({ subKriterias: s.subKriterias.filter((x) => x.id !== id) })),

  // KategoriKamar
  addKategoriKamar: (k) => set((s) => ({ kategoriKamars: [...s.kategoriKamars, { ...k, id: nextId.kategoriKamar++ }] })),
  updateKategoriKamar: (id, k) => set((s) => ({ kategoriKamars: s.kategoriKamars.map((x) => (x.id === id ? { ...x, ...k } : x)) })),
  deleteKategoriKamar: (id) => set((s) => ({ kategoriKamars: s.kategoriKamars.filter((x) => x.id !== id) })),

  // Kamar
  addKamar: (k) => set((s) => ({ kamars: [...s.kamars, { ...k, id: nextId.kamar++ }] })),
  updateKamar: (id, k) => set((s) => ({ kamars: s.kamars.map((x) => (x.id === id ? { ...x, ...k } : x)) })),
  deleteKamar: (id) => set((s) => ({ kamars: s.kamars.filter((x) => x.id !== id) })),

  // FasilitasHotel
  addFasilitas: (f) => set((s) => ({ fasilitasHotels: [...s.fasilitasHotels, { ...f, id: nextId.fasilitas++ }] })),
  updateFasilitas: (id, f) => set((s) => ({ fasilitasHotels: s.fasilitasHotels.map((x) => (x.id === id ? { ...x, ...f } : x)) })),
  deleteFasilitas: (id) => set((s) => ({ fasilitasHotels: s.fasilitasHotels.filter((x) => x.id !== id) })),

  // HotelKriteria
  addHotelKriteria: (hk) => set((s) => ({ hotelKriterias: [...s.hotelKriterias, { ...hk, id: nextId.hotelKriteria++ }] })),
  updateHotelKriteria: (id, hk) => set((s) => ({ hotelKriterias: s.hotelKriterias.map((x) => (x.id === id ? { ...x, ...hk } : x)) })),
  deleteHotelKriteria: (id) => set((s) => ({ hotelKriterias: s.hotelKriterias.filter((x) => x.id !== id) })),

  // PerbandinganKriteria
  addPerbandingan: (p) => set((s) => ({ perbandinganKriterias: [...s.perbandinganKriterias, { ...p, id: nextId.perbandingan++ }] })),
  updatePerbandingan: (id, p) => set((s) => ({ perbandinganKriterias: s.perbandinganKriterias.map((x) => (x.id === id ? { ...x, ...p } : x)) })),
  deletePerbandingan: (id) => set((s) => ({ perbandinganKriterias: s.perbandinganKriterias.filter((x) => x.id !== id) })),
}));
