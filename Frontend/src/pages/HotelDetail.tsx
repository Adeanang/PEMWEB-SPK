import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaWifi,
  FaSwimmingPool,
  FaCoffee,
  FaParking,
  FaSpa,
  FaUtensils,
  FaDumbbell,
  FaFire,
  FaCampground,
  FaConciergeBell,
  FaCheckCircle,
  FaWhatsapp,
  FaInstagram,
  FaShareAlt,
  FaBed,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";
import api from "../utils/api";
import { computeSAW, CRITERIA_KEYS } from "../utils/saw";
import type { CriteriaKey, Hotel, KategoriHotel, Kriteria } from "../types/spk";

// Ikon fasilitas dinamis berdasarkan keyword
const fasilitasIcon = (nama: string) => {
  const n = nama.toLowerCase();
  if (n.includes("wifi")) return <FaWifi />;
  if (n.includes("kolam") || n.includes("renang")) return <FaSwimmingPool />;
  if (n.includes("breakfast") || n.includes("sarapan")) return <FaCoffee />;
  if (n.includes("parkir")) return <FaParking />;
  if (n.includes("spa")) return <FaSpa />;
  if (n.includes("restoran") || n.includes("restaurant")) return <FaUtensils />;
  if (n.includes("gym") || n.includes("fitness")) return <FaDumbbell />;
  if (n.includes("air panas")) return <FaFire />;
  if (n.includes("camping")) return <FaCampground />;
  return <FaConciergeBell />;
};

// Data kamar dummy per hotel (disesuaikan dengan karakter hotel)
const kamarData: Record<
  number,
  {
    id: number;
    nama: string;
    deskripsi: string;
    harga: number;
    kapasitas: string;
    ukuran: string;
    fasilitas: string[];
    gambar: string;
    badge?: string;
  }[]
> = {
  1: [
    {
      id: 1, nama: "Deluxe Room", deskripsi: "Kamar luas dengan pemandangan kolam renang dan fasilitas lengkap untuk kenyamanan maksimal.", harga: 400000, kapasitas: "2 orang", ukuran: "28 m²",
      fasilitas: ["King Bed", "AC", "TV LED 42\"", "Wifi Gratis", "Kamar Mandi Dalam", "Safe Box"],
      gambar: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    },
    {
      id: 2, nama: "Superior Room", deskripsi: "Kamar standar eksklusif dengan sentuhan modern dan pemandangan kota Tegal.", harga: 320000, kapasitas: "2 orang", ukuran: "22 m²",
      fasilitas: ["Queen Bed", "AC", "TV LED 32\"", "Wifi Gratis", "Kamar Mandi Dalam"],
      gambar: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", badge: "Paling Diminati",
    },
    {
      id: 3, nama: "Suite Room", deskripsi: "Kamar mewah dengan ruang tamu terpisah dan bathtub premium. Cocok untuk bulan madu atau acara spesial.", harga: 750000, kapasitas: "2 orang", ukuran: "48 m²",
      fasilitas: ["King Bed", "Ruang Tamu", "Bathtub", "AC", "TV LED 55\"", "Wifi Gratis", "Mini Bar", "Safe Box"],
      gambar: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&q=80", badge: "Premium",
    },
    {
      id: 4, nama: "Meeting Room Package", deskripsi: "Paket kamar dengan akses ruang meeting. Ideal untuk pebisnis yang butuh produktivitas optimal.", harga: 600000, kapasitas: "1-2 orang", ukuran: "30 m²",
      fasilitas: ["Queen Bed", "Akses Meeting Room", "AC", "TV", "Wifi Gratis", "Breakfast"],
      gambar: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    },
  ],
  2: [
    {
      id: 1, nama: "Ocean View Deluxe", deskripsi: "Kamar premium dengan view laut yang memukau, fasilitas spa dan kolam renang pribadi.", harga: 480000, kapasitas: "2 orang", ukuran: "32 m²",
      fasilitas: ["King Bed", "View Laut", "Akses Spa", "AC", "TV LED 43\"", "Wifi Gratis", "Breakfast"],
      gambar: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", badge: "Best Seller",
    },
    {
      id: 2, nama: "Family Room", deskripsi: "Kamar luas dengan dua tempat tidur, cocok untuk keluarga dengan anak-anak.", harga: 650000, kapasitas: "4 orang", ukuran: "45 m²",
      fasilitas: ["2 Queen Bed", "AC", "TV LED 43\"", "Wifi Gratis", "Breakfast", "Akses Kolam Renang"],
      gambar: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80", badge: "Favorit Keluarga",
    },
    {
      id: 3, nama: "Honeymoon Suite", deskripsi: "Suite romantis dengan dekorasi bunga, jacuzzi, dan fasilitas mewah untuk pasangan.", harga: 950000, kapasitas: "2 orang", ukuran: "55 m²",
      fasilitas: ["King Bed", "Jacuzzi", "Dekorasi Romantis", "AC", "TV LED 55\"", "Wifi Gratis", "Breakfast", "Late Check-out"],
      gambar: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80", badge: "Premium",
    },
  ],
  3: [
    {
      id: 1, nama: "Heritage Standard", deskripsi: "Kamar dengan sentuhan arsitektur heritage khas Tegal, nyaman dan bersih untuk perjalanan bisnis.", harga: 300000, kapasitas: "2 orang", ukuran: "20 m²",
      fasilitas: ["Queen Bed", "AC", "TV", "Wifi Gratis", "Kamar Mandi Dalam"],
      gambar: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", badge: "Paling Diminati",
    },
    {
      id: 2, nama: "Heritage Deluxe", deskripsi: "Kamar deluxe bergaya heritage dengan breakfast termasuk dan pemandangan taman kota.", harga: 380000, kapasitas: "2 orang", ukuran: "26 m²",
      fasilitas: ["King Bed", "Breakfast", "AC", "TV LED 32\"", "Wifi Gratis", "Kamar Mandi Dalam"],
      gambar: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80",
    },
  ],
  4: [
    {
      id: 1, nama: "Mountain View Room", deskripsi: "Nikmati sejuknya udara Guci dari kamar dengan pemandangan pegunungan langsung.", harga: 550000, kapasitas: "2 orang", ukuran: "25 m²",
      fasilitas: ["Queen Bed", "AC", "TV", "Wifi Gratis", "Akses Pemandian Air Panas"],
      gambar: "https://images.unsplash.com/photo-1601918774516-d0b05fc2f327?w=600&q=80", badge: "Paling Diminati",
    },
    {
      id: 2, nama: "Camping Glamour", deskripsi: "Pengalaman berkemah mewah di alam terbuka pegunungan Guci dengan fasilitas lengkap.", harga: 450000, kapasitas: "2 orang", ukuran: "Tenda Premium",
      fasilitas: ["Tempat Tidur Kasur", "Listrik", "Akses Toilet", "Akses Pemandian Air Panas", "BBQ Kit"],
      gambar: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80",
    },
    {
      id: 3, nama: "Family Cottage", deskripsi: "Cottage luas di tepi hutan pinus untuk keluarga, lengkap dengan dapur kecil dan area bermain.", harga: 850000, kapasitas: "6 orang", ukuran: "60 m²",
      fasilitas: ["2 Kamar Tidur", "Dapur Mini", "Ruang Santai", "Akses Pemandian Air Panas", "Wifi Gratis", "Restoran"],
      gambar: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&q=80", badge: "Favorit Keluarga",
    },
  ],
  5: [
    {
      id: 1, nama: "Standard Room", deskripsi: "Kamar standar bersih dan nyaman di kawasan Kota Lama Tegal, dekat pusat kuliner.", harga: 200000, kapasitas: "2 orang", ukuran: "16 m²",
      fasilitas: ["Twin Bed", "AC", "TV", "Wifi Gratis", "Kamar Mandi Dalam"],
      gambar: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", badge: "Termurah",
    },
    {
      id: 2, nama: "Superior Room", deskripsi: "Kamar superior dengan area parkir luas dan akses mudah ke kawasan wisata kuliner Tegal.", harga: 250000, kapasitas: "2 orang", ukuran: "20 m²",
      fasilitas: ["Queen Bed", "AC", "TV LED", "Wifi Gratis", "Parkir Gratis"],
      gambar: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80",
    },
  ],
  6: [
    {
      id: 1, nama: "Deluxe International", deskripsi: "Kamar berkelas internasional dengan fasilitas bintang 5 di jantung kota Tegal.", harga: 650000, kapasitas: "2 orang", ukuran: "35 m²",
      fasilitas: ["King Bed", "AC", "TV LED 50\"", "Wifi Gratis", "Akses Gym", "Akses Kolam Renang", "Breakfast"],
      gambar: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", badge: "Best Seller",
    },
    {
      id: 2, nama: "Executive Suite", deskripsi: "Suite eksekutif dengan ruang kerja premium, ideal untuk pebisnis tingkat tinggi.", harga: 1200000, kapasitas: "2 orang", ukuran: "65 m²",
      fasilitas: ["King Bed", "Ruang Kerja", "Jacuzzi", "Akses Spa", "AC", "TV LED 65\"", "Wifi Gratis", "Breakfast", "Concierge 24 Jam"],
      gambar: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&q=80", badge: "Premium",
    },
    {
      id: 3, nama: "Spa Package Room", deskripsi: "Kamar dengan paket spa lengkap — relaksasi total setelah perjalanan jauh.", harga: 900000, kapasitas: "2 orang", ukuran: "40 m²",
      fasilitas: ["King Bed", "1x Sesi Spa", "Akses Kolam Renang", "AC", "TV LED", "Wifi Gratis", "Breakfast"],
      gambar: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80",
    },
  ],
};

const CRITERIA_LABEL: Record<CriteriaKey, string> = {
  harga: "Harga", jarak: "Jarak", rating: "Rating",
  fasilitas: "Fasilitas", kebersihan: "Kebersihan", pelayanan: "Pelayanan",
};

const badgeColor: Record<string, string> = {
  "Paling Diminati": "bg-amber-400 text-white",
  "Best Seller": "bg-emerald-500 text-white",
  "Premium": "bg-violet-600 text-white",
  "Favorit Keluarga": "bg-sky-500 text-white",
  "Termurah": "bg-rose-500 text-white",
};

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const hotelId = Number(id);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [kategoriHotelList, setKategoriHotelList] = useState<KategoriHotel[]>([]);
  const [defaultKriteria, setDefaultKriteria] = useState<Kriteria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hotelsRes, kriteriaRes, kategoriRes] = await Promise.all([
          api.get("/hotels"),
          api.get("/kriteria"),
          api.get("/kategori"),
        ]);
        
        const mappedKriteria = kriteriaRes.data.data.map((k: any) => {
           const keyMap: any = { "C1": "harga", "C2": "jarak", "C3": "rating", "C4": "fasilitas", "C5": "kebersihan", "C6": "pelayanan" };
           const key = keyMap[k.kode] || k.nama.toLowerCase();
           return {
             id_kriteria: k.id,
             kode: k.kode,
             nama: k.nama,
             key: key,
             tipe: k.jenis.toLowerCase(),
             bobot: k.bobot
           };
        });
        
        const mappedHotels = hotelsRes.data.data.map((h: any) => {
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
            image_hotel: h.imageHotel,
            id_user: h.userId,
            lat: h.lat,
            lng: h.lng,
            id_kategori_hotel: h.kategoriHotelId,
            nilai,
            fasilitas_list: h.fasilitasHotels ? h.fasilitasHotels.map((f: any) => f.fasilitas || f.nama_fasilitas).filter(Boolean) : [],
          };
        });

        setHotels(mappedHotels);
        setDefaultKriteria(mappedKriteria);
        setKategoriHotelList(kategoriRes.data.data.map((k: any) => ({
          id: k.id,
          nama_kategori: k.namaKategori || k.nama_kategori
        })));
      } catch (error) {
        console.error("Gagal mengambil data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sky-600 font-bold">Memuat detail hotel...</p>
      </div>
    );
  }

  const hotel = hotels.find((h) => h.id === hotelId);

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-4">
        <p className="text-xl font-bold">Hotel tidak ditemukan 😕</p>
        <Link to="/accommodation" className="text-sky-600 hover:underline text-sm font-medium">
          ← Kembali ke daftar hotel
        </Link>
      </div>
    );
  }

  const kategori = kategoriHotelList.find((k) => k.id === hotel.id_kategori_hotel);
  const starCount = Number(kategori?.nama_kategori.replace(/\D/g, "")) || 0;
  const sawResults = computeSAW(hotels, defaultKriteria);
  const myResult = sawResults.find((r) => r.hotel.id === hotelId);
  const matchPct = myResult ? Math.round(Math.min(myResult.score, 1) * 100) : null;
  const kamarList = kamarData[hotelId] ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={hotel.image_hotel}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold transition"
        >
          <FaArrowLeft size={12} /> Kembali
        </button>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 md:px-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: starCount }).map((_, i) => (
                <FaStar key={i} size={13} className="text-amber-400" />
              ))}
              {kategori && (
                <span className="text-white/70 text-xs ml-2">{kategori.nama_kategori}</span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{hotel.name}</h1>
            <div className="flex items-center gap-2 text-white/80 text-sm mt-2">
              <FaMapMarkerAlt size={12} />
              <span>{hotel.location} · {hotel.nilai.jarak} km dari pusat kota</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Info bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Rating */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500 text-xl font-bold">
              <FaStar />
              <span>{hotel.nilai.rating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Rating Ulasan</p>
          </div>
          {/* Match % */}
          {matchPct !== null && (
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
              <p className="text-xl font-bold text-emerald-600">{matchPct}%</p>
              <p className="text-xs text-slate-400 mt-1">Sesuai Prioritasmu</p>
            </div>
          )}
          {/* Kebersihan */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
            <p className="text-xl font-bold text-sky-600">{hotel.nilai.kebersihan.toFixed(1)}</p>
            <p className="text-xs text-slate-400 mt-1">Kebersihan</p>
          </div>
          {/* Pelayanan */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
            <p className="text-xl font-bold text-cyan-600">{hotel.nilai.pelayanan.toFixed(1)}</p>
            <p className="text-xs text-slate-400 mt-1">Pelayanan</p>
          </div>
        </div>

        {/* ── Grid: Fasilitas & Skor SAW ─────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Fasilitas */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FaConciergeBell className="text-sky-500" /> Fasilitas Hotel
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {hotel.fasilitas_list.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-slate-700 bg-sky-50 rounded-xl px-3 py-2.5">
                  <span className="text-sky-500 shrink-0">{fasilitasIcon(f)}</span>
                  <span className="font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skor SAW */}
          {myResult && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-emerald-500" /> Penilaian Sistem SPK
              </h2>
              <div className="space-y-3">
                {CRITERIA_KEYS.map((key) => {
                  const k = defaultKriteria.find((kr) => kr.key === key)!;
                  const rawVal = hotel.nilai[key];
                  const display =
                    key === "harga" ? `Rp ${rawVal.toLocaleString("id-ID")}` :
                    key === "jarak" ? `${rawVal} km` :
                    key === "fasilitas" ? `${rawVal} item` :
                    rawVal.toFixed(1);
                  const normalizedBar = Math.min(myResult.terbobot[key] / (k.bobot / 100), 1);
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-slate-600">{CRITERIA_LABEL[key]}</span>
                        <span className="text-slate-700 font-semibold">{display}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full"
                          style={{ width: `${normalizedBar * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <p className="text-[10px] text-slate-400 pt-1">
                  Ranking #{myResult.ranking} dari {sawResults.length} hotel
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Kontak */}
        {hotel.sosial_media && (
          <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl border border-sky-100 p-5 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm">Hubungi Hotel Langsung</p>
              <p className="text-slate-400 text-xs mt-0.5">Tanyakan ketersediaan kamar atau informasi lebih lanjut</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`https://wa.me/?text=Halo, saya tertarik memesan kamar di ${hotel.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-md"
              >
                <FaWhatsapp /> WhatsApp
              </a>
              <a
                href={`https://instagram.com/${hotel.sosial_media}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-rose-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-md"
              >
                <FaInstagram /> Instagram
              </a>
            </div>
          </div>
        )}

        {/* ── DAFTAR KAMAR ──────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FaBed className="text-sky-500" /> Pilih Kamar
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">{kamarList.length} tipe kamar tersedia</p>
            </div>
            <button className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-sky-600 bg-white border border-slate-200 px-3 py-2 rounded-xl transition">
              <FaShareAlt size={11} /> Bagikan
            </button>
          </div>

          <div className="space-y-5">
            {kamarList.map((kamar) => (
              <div
                key={kamar.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition duration-300 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Gambar kamar */}
                  <div className="sm:w-60 h-48 sm:h-auto relative shrink-0">
                    <img
                      src={kamar.gambar}
                      alt={kamar.nama}
                      className="w-full h-full object-cover"
                    />
                    {kamar.badge && (
                      <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow ${badgeColor[kamar.badge] ?? "bg-slate-700 text-white"}`}>
                        {kamar.badge}
                      </span>
                    )}
                  </div>

                  {/* Detail kamar */}
                  <div className="flex-1 p-5 sm:p-6 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{kamar.nama}</h3>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1"><FaUsers size={10} /> {kamar.kapasitas}</span>
                          <span className="flex items-center gap-1"><FaBed size={10} /> {kamar.ukuran}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">{kamar.deskripsi}</p>

                    {/* Fasilitas kamar */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {kamar.fasilitas.map((f) => (
                        <span key={f} className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                          <FaCheckCircle size={9} className="text-emerald-500" /> {f}
                        </span>
                      ))}
                    </div>

                    {/* Harga & CTA */}
                    <div className="mt-auto pt-4 flex items-end justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-[11px] text-slate-400">Harga per malam</p>
                        <p className="text-2xl font-bold text-sky-600">
                          Rp {kamar.harga.toLocaleString("id-ID")}
                          <span className="text-xs font-normal text-slate-400">/malam</span>
                        </p>
                      </div>
                      <a
                        href={`https://wa.me/?text=Halo, saya ingin memesan kamar ${kamar.nama} di ${hotel.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-sky-500/20"
                      >
                        <FaWhatsapp /> Pesan via WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-sky-600 to-cyan-500 rounded-3xl p-7 text-white text-center shadow-xl shadow-sky-500/20">
          <h3 className="text-xl font-bold">Butuh Bantuan Memilih?</h3>
          <p className="text-sky-100 text-sm mt-2 max-w-md mx-auto">
            Gunakan sistem rekomendasi cerdas WisTel — kami bantu pilihkan kamar terbaik sesuai kebutuhanmu.
          </p>
          <Link
            to="/accommodation"
            className="inline-flex items-center gap-2 mt-5 bg-white text-sky-600 font-bold px-6 py-3 rounded-xl hover:bg-sky-50 transition shadow-lg text-sm"
          >
            ← Lihat Rekomendasi Lainnya
          </Link>
        </div>
      </div>
    </div>
  );
}
