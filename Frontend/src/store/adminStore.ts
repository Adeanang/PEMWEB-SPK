import { create } from 'zustand';
import api from '../utils/api';
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
  rekomendasiRequests: RekomendasiRequest[];

  isFetching: boolean;
  fetchAdminData: () => Promise<void>;

  // Hotel CRUD
  addHotel: (h: Omit<Hotel, 'id'>) => Promise<void>;
  updateHotel: (id: number, h: Partial<Hotel>) => Promise<void>;
  deleteHotel: (id: number) => Promise<void>;

  // User CRUD
  addUser: (u: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: number, u: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  // KategoriHotel CRUD
  addKategoriHotel: (k: Omit<KategoriHotel, 'id'>) => Promise<void>;
  updateKategoriHotel: (id: number, k: Partial<KategoriHotel>) => Promise<void>;
  deleteKategoriHotel: (id: number) => Promise<void>;

  // Kriteria CRUD
  addKriteria: (k: Omit<Kriteria, 'id_kriteria'>) => Promise<void>;
  updateKriteria: (id: number, k: Partial<Kriteria>) => Promise<void>;
  deleteKriteria: (id: number) => Promise<void>;

  // SubKriteria CRUD
  addSubKriteria: (s: Omit<AdminSubKriteria, 'id'>) => Promise<void>;
  updateSubKriteria: (id: number, s: Partial<AdminSubKriteria>) => Promise<void>;
  deleteSubKriteria: (id: number) => Promise<void>;

  // KategoriKamar CRUD
  addKategoriKamar: (k: Omit<KategoriKamar, 'id'>) => Promise<void>;
  updateKategoriKamar: (id: number, k: Partial<KategoriKamar>) => Promise<void>;
  deleteKategoriKamar: (id: number) => Promise<void>;

  // Kamar CRUD
  addKamar: (k: Omit<Kamar, 'id'>) => Promise<void>;
  updateKamar: (id: number, k: Partial<Kamar>) => Promise<void>;
  deleteKamar: (id: number) => Promise<void>;

  // FasilitasHotel CRUD
  addFasilitas: (f: Omit<FasilitasHotel, 'id'>) => Promise<void>;
  updateFasilitas: (id: number, f: Partial<FasilitasHotel>) => Promise<void>;
  deleteFasilitas: (id: number) => Promise<void>;

  // HotelKriteria CRUD
  addHotelKriteria: (hk: Omit<HotelKriteria, 'id'>) => Promise<void>;
  updateHotelKriteria: (id: number, hk: Partial<HotelKriteria>) => Promise<void>;
  deleteHotelKriteria: (id: number) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  hotels: [],
  users: [],
  kategoriHotels: [],
  kriterias: [],
  subKriterias: [],
  kategoriKamars: [],
  kamars: [],
  fasilitasHotels: [],
  hotelKriterias: [],
  perbandinganKriterias: [],
  rekomendasiRequests: [],
  isFetching: false,

  fetchAdminData: async () => {
    set({ isFetching: true });
    try {
      const [
        hotelsRes,
        usersRes,
        kategoriRes,
        kriteriaRes,
        subKriteriaRes,
        kamarRes,
        fasilitasRes,
        hotelKriteriaRes
      ] = await Promise.allSettled([
        api.get('/hotels'),
        api.get('/users'),
        api.get('/kategori'),
        api.get('/kriteria'),
        api.get('/sub-kriteria'),
        api.get('/kamar'),
        api.get('/fasilitas-hotel'),
        api.get('/hotel-kriteria'),
      ]);

      const stateUpdate: Partial<AdminStore> = {};

      if (kriteriaRes.status === 'fulfilled' && kriteriaRes.value.data.data) {
        stateUpdate.kriterias = kriteriaRes.value.data.data.map((k: any) => {
          const keyMap: any = { "C1": "harga", "C2": "jarak", "C3": "rating", "C4": "fasilitas", "C5": "kebersihan", "C6": "pelayanan" };
          return {
            id_kriteria: k.id,
            kode: k.kode,
            nama: k.nama,
            key: keyMap[k.kode] || k.nama.toLowerCase(),
            tipe: k.jenis?.toLowerCase() || 'benefit',
            bobot: k.bobot
          };
        });
      }

      if (hotelsRes.status === 'fulfilled' && hotelsRes.value.data.data) {
        stateUpdate.hotels = hotelsRes.value.data.data.map((h: any) => {
          const nilai: any = { harga: 0, jarak: 0, rating: 0, fasilitas: 0, kebersihan: 0, pelayanan: 0 };
          if (h.hotelKriterias) {
            h.hotelKriterias.forEach((hk: any) => {
              const keyMap: any = { "C1": "harga", "C2": "jarak", "C3": "rating", "C4": "fasilitas", "C5": "kebersihan", "C6": "pelayanan" };
              const key = keyMap[hk.kriteria?.kode] || hk.kriteria?.nama?.toLowerCase();
              if (key && key in nilai) {
                nilai[key] = hk.nilai || 0;
              }
            });
          }
          return {
            id: h.id,
            name: h.name,
            location: h.location,
            sosial_media: h.sosialMedia,
            image_hotel: h.imageHotel?.trim() || null,
            id_user: h.userId,
            lat: h.lat,
            lng: h.lng,
            id_kategori_hotel: h.kategoriHotelId,
            nilai,
            fasilitas_list: h.fasilitasHotels
              ? h.fasilitasHotels
                .map((f: any) => f.fasilitas || f.nama_fasilitas)
                .filter(Boolean)
              : [],
          };
        });
      }

      if (usersRes.status === 'fulfilled' && usersRes.value.data.data) {
        stateUpdate.users = usersRes.value.data.data;
      }

      if (kategoriRes.status === 'fulfilled' && kategoriRes.value.data.data) {
        stateUpdate.kategoriHotels = kategoriRes.value.data.data.map((k: any) => ({
          id: k.id,
          nama_kategori: k.namaKategori || k.nama_kategori || '',
          deskripsi: k.deskripsi || ''
        }));
      }

      if (subKriteriaRes.status === 'fulfilled' && subKriteriaRes.value.data.data) {
        stateUpdate.subKriterias = subKriteriaRes.value.data.data;
      }

      if (kamarRes.status === 'fulfilled' && kamarRes.value.data.data) {
        stateUpdate.kamars = kamarRes.value.data.data;
      }

      if (fasilitasRes.status === 'fulfilled' && fasilitasRes.value.data.data) {
        stateUpdate.fasilitasHotels = fasilitasRes.value.data.data;
      }

      if (hotelKriteriaRes.status === 'fulfilled' && hotelKriteriaRes.value.data.data) {
        stateUpdate.hotelKriterias = hotelKriteriaRes.value.data.data;
      }

      set(stateUpdate);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      set({ isFetching: false });
    }
  },

  // Hotel CRUD
  addHotel: async (h) => {
    // Transform to backend format
    const { kriterias } = get();
    const kriteriaPayload = h.nilai ? Object.entries(h.nilai).map(([key, val]) => {
      const k = kriterias.find(k => k.key === key);
      return k ? { kriteriaId: k.id_kriteria, nilai: val } : null;
    }).filter(Boolean) : [];

    const payload = {
      name: h.name,
      location: h.location,
      sosialMedia: h.sosial_media,
      imageHotel: h.image_hotel,
      userId: h.id_user,
      lat: h.lat,
      lng: h.lng,
      kategoriHotelId: h.id_kategori_hotel,
      kriteria: kriteriaPayload,
    };

    const res = await api.post('/hotels', payload);
    const hotelId = res.data.data.id;

    if (h.fasilitas_list && h.fasilitas_list.length > 0) {
      await Promise.allSettled(
        h.fasilitas_list.map(f => api.post('/fasilitas-hotel', { hotelId, nama_fasilitas: f }))
      );
    }

    await get().fetchAdminData();
  },
  updateHotel: async (id, h) => {
    const payload: any = {};
    if (h.name !== undefined) payload.name = h.name;
    if (h.location !== undefined) payload.location = h.location;
    if (h.sosial_media !== undefined) payload.sosialMedia = h.sosial_media;
    if (h.image_hotel !== undefined) payload.imageHotel = h.image_hotel;
    if (h.id_user !== undefined) payload.userId = h.id_user;
    if (h.lat !== undefined) payload.lat = h.lat;
    if (h.lng !== undefined) payload.lng = h.lng;
    if (h.id_kategori_hotel !== undefined) payload.kategoriHotelId = h.id_kategori_hotel;

    await api.put(`/hotels/${id}`, payload);

    if (h.nilai) {
      const { kriterias, hotelKriterias } = get();
      const existingHk = hotelKriterias.filter(hk => hk.hotelId === id);

      const updatePromises = Object.entries(h.nilai).map(([key, val]) => {
        const k = kriterias.find(k => k.key === key);
        if (!k) return null;
        const hk = existingHk.find(x => x.kriteriaId === k.id_kriteria);
        if (hk) {
          return api.put(`/hotel-kriteria/${hk.id}`, { hotelId: id, kriteriaId: k.id_kriteria, nilai: val });
        } else {
          return api.post('/hotel-kriteria', { hotelId: id, kriteriaId: k.id_kriteria, nilai: val });
        }
      }).filter(Boolean);

      await Promise.allSettled(updatePromises as any);
    }

    if (h.fasilitas_list !== undefined) {
      const { fasilitasHotels } = get();
      const existingFasilitas = fasilitasHotels.filter(f => f.hotelId === id);
      // Simplify: delete all existing, then add new ones
      await Promise.allSettled(existingFasilitas.map(f => api.delete(`/fasilitas-hotel/${f.id}`)));
      if (h.fasilitas_list.length > 0) {
        await Promise.allSettled(h.fasilitas_list.map(f => api.post('/fasilitas-hotel', { hotelId: id, nama_fasilitas: f })));
      }
    }

    await get().fetchAdminData();
  },
  deleteHotel: async (id) => {
    await api.delete(`/hotels/${id}`);
    await get().fetchAdminData();
  },

  // User CRUD
  addUser: async (u) => {
    await api.post('/auth/register', { name: u.email.split('@')[0], email: u.email, password: "password123", role: u.role });
    await get().fetchAdminData();
  },
  updateUser: async (id, u) => {
    await api.put(`/users/${id}`, u);
    await get().fetchAdminData();
  },
  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
    await get().fetchAdminData();
  },
  // KategoriHotel CRUD
  addKategoriHotel: async (k) => {
    await api.post('/kategori', {
      namaKategori: k.nama_kategori,
    });

    await get().fetchAdminData();
  },

  updateKategoriHotel: async (id, k) => {
    await api.put(`/kategori/${id}`, {
      namaKategori: k.nama_kategori,
    });

    await get().fetchAdminData();
  },

  deleteKategoriHotel: async (id) => {
    await api.delete(`/kategori/${id}`);
    await get().fetchAdminData();
  },
  // Kriteria CRUD
  addKriteria: async (k) => {
    await api.post('/kriteria', { kode: k.kode, nama: k.nama, bobot: k.bobot, jenis: k.tipe.toUpperCase() });
    await get().fetchAdminData();
  },
  updateKriteria: async (id, k) => {
    const payload: any = {};
    if (k.kode !== undefined) payload.kode = k.kode;
    if (k.nama !== undefined) payload.nama = k.nama;
    if (k.bobot !== undefined) payload.bobot = k.bobot;
    if (k.tipe !== undefined) payload.jenis = k.tipe.toUpperCase();
    await api.put(`/kriteria/${id}`, payload);
    await get().fetchAdminData();
  },
  deleteKriteria: async (id) => {
    await api.delete(`/kriteria/${id}`);
    await get().fetchAdminData();
  },

  // SubKriteria CRUD
  addSubKriteria: async (s) => {
    await api.post('/sub-kriteria', s);
    await get().fetchAdminData();
  },
  updateSubKriteria: async (id, s) => {
    await api.put(`/sub-kriteria/${id}`, s);
    await get().fetchAdminData();
  },
  deleteSubKriteria: async (id) => {
    await api.delete(`/sub-kriteria/${id}`);
    await get().fetchAdminData();
  },

  // KategoriKamar CRUD
  addKategoriKamar: async (k) => {
    await api.post('/kategori-kamar', k);
    await get().fetchAdminData();
  },
  updateKategoriKamar: async (id, k) => {
    await api.put(`/kategori-kamar/${id}`, k);
    await get().fetchAdminData();
  },
  deleteKategoriKamar: async (id) => {
    await api.delete(`/kategori-kamar/${id}`);
    await get().fetchAdminData();
  },

  // Kamar CRUD
  addKamar: async (k) => {
    await api.post('/kamar', k);
    await get().fetchAdminData();
  },
  updateKamar: async (id, k) => {
    await api.put(`/kamar/${id}`, k);
    await get().fetchAdminData();
  },
  deleteKamar: async (id) => {
    await api.delete(`/kamar/${id}`);
    await get().fetchAdminData();
  },

  // FasilitasHotel CRUD
  addFasilitas: async (f) => {
    await api.post('/fasilitas-hotel', { hotelId: f.hotelId, nama_fasilitas: f.fasilitas });
    await get().fetchAdminData();
  },
  updateFasilitas: async (id, f) => {
    await api.put(`/fasilitas-hotel/${id}`, { hotelId: f.hotelId, nama_fasilitas: f.fasilitas });
    await get().fetchAdminData();
  },
  deleteFasilitas: async (id) => {
    await api.delete(`/fasilitas-hotel/${id}`);
    await get().fetchAdminData();
  },

  // HotelKriteria CRUD
  addHotelKriteria: async (hk) => {
    await api.post('/hotel-kriteria', hk);
    await get().fetchAdminData();
  },
  updateHotelKriteria: async (id, hk) => {
    await api.put(`/hotel-kriteria/${id}`, hk);
    await get().fetchAdminData();
  },
  deleteHotelKriteria: async (id) => {
    await api.delete(`/hotel-kriteria/${id}`);
    await get().fetchAdminData();
  },

  // PerbandinganKriteria CRUD
}));
