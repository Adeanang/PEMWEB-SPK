import { useNavigate } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaBolt, FaShieldAlt, FaHotel } from "react-icons/fa";
import { hotels, kategoriHotelList, defaultKriteria } from "../data/spkData";
import { computeSAW } from "../utils/saw";

export default function Home() {
  const navigate = useNavigate();

  const statistics = [
    { value: `${hotels.length}+`, label: "Hotel Terdaftar di Tegal" },
    { value: "6", label: "Kriteria Penilaian Objektif" },
    { value: "100%", label: "Berbasis Data, Bukan Tebakan" },
  ];

  // Rekomendasi teratas dihitung otomatis pakai metode SAW (bobot default)
  const topPicks = computeSAW(hotels, defaultKriteria).slice(0, 3);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-cyan-500 to-sky-400" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center text-white">
          <span className="inline-flex px-4 py-2 rounded-full bg-white/20 backdrop-blur text-sm font-medium">
            Fokus 100% di Kota Tegal
          </span>

          <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
            Nginap di Tegal?
            <br />
            Biar Kami Pilihkan yang Terbaik.
          </h1>

          <p className="mt-6 text-lg text-sky-50 max-w-2xl mx-auto">
            WisTour membandingkan harga, jarak, rating, fasilitas, kebersihan, dan
            pelayanan setiap hotel di Tegal, lalu menyusun rekomendasi paling sesuai
            dengan prioritasmu — bukan sekadar iklan berbayar.
          </p>

          <div className="mt-10 max-w-xl mx-auto bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Cari nama hotel atau area di Tegal..."
              className="flex-1 px-4 py-3 text-sm text-slate-700 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate("/accommodation");
              }}
            />
            <button
              onClick={() => navigate("/accommodation")}
              className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold text-sm transition duration-200 shadow-lg shadow-sky-500/20 px-6 py-3"
            >
              Cari Hotel Terbaik
            </button>
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      <section className="-mt-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {statistics.map((item) => (
              <div key={item.label} className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-4xl font-bold text-sky-600">{item.value}</h3>
                <p className="mt-2 text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KENAPA WISTOUR */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800">
            Bukan Cuma Daftar Hotel Biasa
          </h2>
          <p className="text-center text-slate-500 mt-4 max-w-xl mx-auto">
            Setiap hotel dinilai dengan metode Sistem Pendukung Keputusan (SAW) yang
            transparan, jadi kamu tahu persis kenapa sebuah hotel direkomendasikan.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl">
                <FaBolt />
              </div>
              <h3 className="mt-5 font-bold text-lg text-slate-800">Sesuai Prioritasmu</h3>
              <p className="mt-2 text-slate-500 text-sm">
                Atur sendiri mana yang lebih penting: harga murah, jarak dekat, atau
                rating tinggi. Urutan hotel menyesuaikan otomatis.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl">
                <FaShieldAlt />
              </div>
              <h3 className="mt-5 font-bold text-lg text-slate-800">Penilaian Objektif</h3>
              <p className="mt-2 text-slate-500 text-sm">
                6 kriteria terukur — harga, jarak, rating, fasilitas, kebersihan,
                pelayanan — dihitung dengan metode SAW yang bisa kamu telusuri.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl">
                <FaHotel />
              </div>
              <h3 className="mt-5 font-bold text-lg text-slate-800">Khusus Tegal</h3>
              <p className="mt-2 text-slate-500 text-sm">
                Fokus penuh ke hotel-hotel di Kota Tegal, jadi rekomendasinya relevan
                dan tidak tercampur daerah lain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REKOMENDASI TERATAS */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                Rekomendasi Teratas Saat Ini
              </h2>
              <p className="text-slate-500 mt-2">
                Berdasarkan penilaian bawaan sistem — bisa berubah sesuai prioritasmu.
              </p>
            </div>
            <button
              onClick={() => navigate("/accommodation")}
              className="text-sky-600 font-semibold hover:text-sky-700 text-sm"
            >
              Lihat semua hotel →
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {topPicks.map((r) => (
              <div
                key={r.hotel.id}
                className="bg-slate-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 flex flex-col"
              >
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    src={r.hotel.image_hotel}
                    alt={r.hotel.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-sky-600 shadow">
                    {kategoriHotelList.find((k) => k.id === r.hotel.id_kategori_hotel)?.nama_kategori}
                  </span>
                  {r.ranking === 1 && (
                    <span className="absolute top-4 right-4 bg-amber-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                      #1 Pilihan
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-xl text-slate-800">{r.hotel.name}</h3>
                      <div className="flex items-center gap-1 text-amber-500 shrink-0">
                        <FaStar size={16} />
                        <span className="text-sm font-semibold text-slate-700">
                          {r.hotel.nilai.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
                      <FaMapMarkerAlt /> {r.hotel.location}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Mulai dari</p>
                      <p className="text-lg font-bold text-sky-600">
                        Rp {r.hotel.nilai.harga.toLocaleString("id-ID")}
                        <span className="text-xs font-normal text-slate-500">/malam</span>
                      </p>
                    </div>

                    <button
                      onClick={() => navigate("/accommodation")}
                      className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-md shadow-sky-500/10"
                    >
                      Lihat Kamar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl bg-linear-to-r from-sky-600 to-cyan-500 p-12 text-center text-white">
            <h2 className="text-4xl font-bold">Siap Menginap di Tegal?</h2>
            <p className="mt-4">
              Bandingkan hotel sesuai prioritasmu dan temukan yang paling pas.
            </p>
            <button
              onClick={() => navigate("/accommodation")}
              className="mt-8 bg-white text-sky-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
            >
              Mulai Cari Hotel
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
