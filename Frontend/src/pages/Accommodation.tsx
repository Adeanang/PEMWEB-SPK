import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaSearch,
  FaSlidersH,
  FaMedal,
  FaChevronDown,
  FaChevronUp,
  FaRedo,
  FaCheckCircle,
  FaBolt,
} from "react-icons/fa";
import {
  hotels as allHotels,
  defaultKriteria,
  kategoriHotelList,
  subKriteriaHarga,
} from "../data/spkData";
import { computeSAW, CRITERIA_KEYS } from "../utils/saw";
import type { Kriteria, CriteriaKey, SAWResult } from "../types/spk";

type SortBy = "rekomendasi" | "harga_asc" | "harga_desc" | "rating" | "jarak";

const CRITERIA_LABEL: Record<CriteriaKey, string> = {
  harga: "Harga",
  jarak: "Jarak lokasi",
  rating: "Rating ulasan",
  fasilitas: "Kelengkapan fasilitas",
  kebersihan: "Kebersihan",
  pelayanan: "Pelayanan",
};

function starCountFromKategori(id: number) {
  const nama = kategoriHotelList.find((k) => k.id === id)?.nama_kategori ?? "";
  return Number(nama.replace(/\D/g, "")) || 0;
}

function topContributors(result: SAWResult, n = 2) {
  return [...CRITERIA_KEYS]
    .sort((a, b) => result.terbobot[b] - result.terbobot[a])
    .slice(0, n)
    .map((key) => CRITERIA_LABEL[key]);
}

export default function Accommodation() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedHarga, setSelectedHarga] = useState<number | "">("");
  const [selectedFasilitas, setSelectedFasilitas] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("rekomendasi");
  const [showPreferensi, setShowPreferensi] = useState(false);
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>(
    defaultKriteria.map((k) => ({ ...k }))
  );
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const allFasilitas = useMemo(() => {
    const set = new Set<string>();
    allHotels.forEach((h) => h.fasilitas_list.forEach((f) => set.add(f)));
    return Array.from(set).sort();
  }, []);

  const toggleStar = (id: number) => {
    setSelectedStars((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleFasilitas = (f: string) => {
    setSelectedFasilitas((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const handleBobotChange = (id: number, value: number) => {
    setKriteriaList((prev) =>
      prev.map((k) => (k.id_kriteria === id ? { ...k, bobot: value } : k))
    );
  };

  const handleResetSemua = () => {
    setSearchQuery("");
    setSelectedStars([]);
    setSelectedHarga("");
    setSelectedFasilitas([]);
    setKriteriaList(defaultKriteria.map((k) => ({ ...k })));
    setSortBy("rekomendasi");
  };

  const filteredHotels = useMemo(() => {
    return allHotels.filter((h) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStar =
        selectedStars.length === 0 || selectedStars.includes(h.id_kategori_hotel);

      let matchHarga = true;
      if (selectedHarga !== "") {
        const sub = subKriteriaHarga.find((s) => s.id_sub === selectedHarga);
        if (sub) {
          matchHarga = h.nilai.harga >= (sub.min ?? 0) && h.nilai.harga < (sub.max ?? Infinity);
        }
      }

      const matchFasilitas =
        selectedFasilitas.length === 0 ||
        selectedFasilitas.every((f) => h.fasilitas_list.includes(f));

      return matchSearch && matchStar && matchHarga && matchFasilitas;
    });
  }, [searchQuery, selectedStars, selectedHarga, selectedFasilitas]);

  const sawByHotelId = useMemo(() => {
    const results = computeSAW(filteredHotels, kriteriaList);
    const map = new Map<number, SAWResult>();
    results.forEach((r) => map.set(r.hotel.id, r));
    return { results, map };
  }, [filteredHotels, kriteriaList]);

  const sortedList = useMemo(() => {
    const base = [...filteredHotels];
    switch (sortBy) {
      case "harga_asc":
        base.sort((a, b) => a.nilai.harga - b.nilai.harga);
        break;
      case "harga_desc":
        base.sort((a, b) => b.nilai.harga - a.nilai.harga);
        break;
      case "rating":
        base.sort((a, b) => b.nilai.rating - a.nilai.rating);
        break;
      case "jarak":
        base.sort((a, b) => a.nilai.jarak - b.nilai.jarak);
        break;
      case "rekomendasi":
      default:
        base.sort((a, b) => {
          const sa = sawByHotelId.map.get(a.id)?.score ?? 0;
          const sb = sawByHotelId.map.get(b.id)?.score ?? 0;
          return sb - sa;
        });
        break;
    }
    return base;
  }, [filteredHotels, sortBy, sawByHotelId]);

  const totalBobot = kriteriaList.reduce((sum, k) => sum + k.bobot, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* HERO PENCARIAN */}
      <section className="bg-gradient-to-br from-sky-600 via-cyan-500 to-sky-400 text-white pt-14 pb-28 relative overflow-hidden">
        <div className="absolute top-0 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-white/20 backdrop-blur text-xs font-semibold tracking-wide">
            KHUSUS KOTA TEGAL
          </span>
          <h1 className="mt-5 text-3xl md:text-4xl font-bold">
            Temukan Hotel Terbaik di Tegal
          </h1>
          <p className="mt-3 text-sky-100 max-w-2xl mx-auto">
            Kami bandingkan harga, jarak, rating, fasilitas, kebersihan, dan pelayanan
            tiap hotel supaya kamu langsung dapat pilihan yang paling pas.
          </p>
        </div>
      </section>

      {/* SEARCH BAR MENGAMBANG */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-2 border border-slate-100">
          <div className="flex items-center flex-1 px-4 gap-3">
            <FaSearch className="text-sky-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama hotel atau area di Tegal..."
              className="w-full py-3 text-sm focus:outline-none text-slate-700"
            />
          </div>
          <button
            onClick={() => setShowPreferensi((v) => !v)}
            className="flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 px-5 py-3 rounded-xl font-semibold text-sm transition shrink-0"
          >
            <FaSlidersH /> Sesuaikan Prioritas
          </button>
        </div>
      </div>

      {/* PANEL PREFERENSI (opsional, ala "urutkan sesuai kebutuhanmu") */}
      {showPreferensi && (
        <div className="max-w-5xl mx-auto px-6 mt-4">
          <div className="bg-white rounded-2xl shadow-lg border border-sky-100 p-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <FaBolt className="text-sky-500" /> Apa yang paling penting buatmu?
                </h3>
                <p
                  className={`text-xs mt-1 font-medium ${
                    totalBobot === 100 ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  Total prioritas: {totalBobot}%{" "}
                  {totalBobot !== 100 && "(otomatis diseimbangkan saat dihitung)"}
                </p>
              </div>
              <button
                onClick={() => setKriteriaList(defaultKriteria.map((k) => ({ ...k })))}
                className="flex items-center gap-2 text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                <FaRedo size={11} /> Kembalikan default
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              {kriteriaList.map((k) => (
                <div key={k.id_kriteria}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">
                      {CRITERIA_LABEL[k.key]}
                    </span>
                    <span className="font-bold text-sky-600">{k.bobot}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={k.bobot}
                    onChange={(e) => handleBobotChange(k.id_kriteria, Number(e.target.value))}
                    className="w-full mt-2 accent-sky-500"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Urutan "Rekomendasi Terbaik" di bawah akan otomatis menyesuaikan dengan
              prioritas ini.
            </p>
          </div>
        </div>
      )}

      {/* BODY: SIDEBAR + LIST */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[280px_1fr] gap-8">
        {/* SIDEBAR FILTER */}
        <aside className="space-y-5 lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h4 className="font-bold text-slate-800 mb-3">Rentang Harga / Malam</h4>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="radio"
                  name="harga"
                  checked={selectedHarga === ""}
                  onChange={() => setSelectedHarga("")}
                  className="accent-sky-500"
                />
                Semua Harga
              </label>
              {subKriteriaHarga.map((s) => (
                <label
                  key={s.id_sub}
                  className="flex items-center gap-2 cursor-pointer text-slate-600"
                >
                  <input
                    type="radio"
                    name="harga"
                    checked={selectedHarga === s.id_sub}
                    onChange={() => setSelectedHarga(s.id_sub)}
                    className="accent-sky-500"
                  />
                  {s.value}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h4 className="font-bold text-slate-800 mb-3">Kategori Bintang</h4>
            <div className="space-y-2 text-sm">
              {kategoriHotelList.map((k) => (
                <label
                  key={k.id}
                  className="flex items-center gap-2 cursor-pointer text-slate-600"
                >
                  <input
                    type="checkbox"
                    checked={selectedStars.includes(k.id)}
                    onChange={() => toggleStar(k.id)}
                    className="accent-sky-500"
                  />
                  <span className="flex items-center gap-1">
                    {Array.from({ length: k.id }).map((_, i) => (
                      <FaStar key={i} className="text-amber-400" size={11} />
                    ))}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h4 className="font-bold text-slate-800 mb-3">Fasilitas</h4>
            <div className="space-y-2 text-sm max-h-48 overflow-y-auto pr-1">
              {allFasilitas.map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={selectedFasilitas.includes(f)}
                    onChange={() => toggleFasilitas(f)}
                    className="accent-sky-500"
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleResetSemua}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-sky-600 py-2"
          >
            <FaRedo size={11} /> Reset semua filter
          </button>
        </aside>

        {/* LIST HOTEL */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <p className="text-sm text-slate-500">
              <span className="font-bold text-slate-800">{sortedList.length} hotel</span>{" "}
              ditemukan di Tegal
            </p>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-sky-500"
            >
              <option value="rekomendasi">Urutkan: Rekomendasi Terbaik</option>
              <option value="harga_asc">Urutkan: Harga Terendah</option>
              <option value="harga_desc">Urutkan: Harga Tertinggi</option>
              <option value="rating">Urutkan: Rating Tertinggi</option>
              <option value="jarak">Urutkan: Terdekat</option>
            </select>
          </div>

          {sortedList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-100">
              <p className="text-slate-400 font-medium">
                Tidak ada hotel yang cocok dengan filter kamu. Coba longgarkan filternya, yuk.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {sortedList.map((hotel, index) => {
                const result = sawByHotelId.map.get(hotel.id);
                const matchPercent = result ? Math.round(Math.min(result.score, 1) * 100) : null;
                const isTopPick = sortBy === "rekomendasi" && index === 0;
                const stars = starCountFromKategori(hotel.id_kategori_hotel);

                return (
                  <div
                    key={hotel.id}
                    className={`bg-white rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border overflow-hidden ${
                      isTopPick ? "border-amber-300 ring-2 ring-amber-100" : "border-slate-100"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* GAMBAR */}
                      <div className="sm:w-64 h-48 sm:h-auto relative shrink-0">
                        <img
                          src={hotel.image_hotel}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        {isTopPick && (
                          <span className="absolute top-3 left-3 flex items-center gap-1 bg-amber-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                            <FaMedal size={11} /> Rekomendasi Terbaik
                          </span>
                        )}
                      </div>

                      {/* KONTEN */}
                      <div className="flex-1 p-5 sm:p-6 flex flex-col">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1.5">
                              {Array.from({ length: stars }).map((_, i) => (
                                <FaStar key={i} className="text-amber-400" size={12} />
                              ))}
                            </div>
                            <h3 className="mt-1 text-lg font-bold text-slate-800">
                              {hotel.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                              <FaMapMarkerAlt />
                              {hotel.location} · {hotel.nilai.jarak} km dari pusat kota
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 bg-sky-50 text-sky-700 font-bold text-sm px-3 py-1.5 rounded-xl">
                            <FaStar className="text-amber-500" />
                            {hotel.nilai.rating.toFixed(1)}
                          </div>
                        </div>

                        {/* TAG FASILITAS */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {hotel.fasilitas_list.slice(0, 3).map((f) => (
                            <span
                              key={f}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium"
                            >
                              {f}
                            </span>
                          ))}
                          {hotel.fasilitas_list.length > 3 && (
                            <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">
                              +{hotel.fasilitas_list.length - 3} lainnya
                            </span>
                          )}
                        </div>

                        {/* MATCH % & ALASAN */}
                        {result && matchPercent !== null && (
                          <div className="mt-4 flex items-center gap-2 text-xs">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[140px]">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-400 to-sky-500"
                                style={{ width: `${matchPercent}%` }}
                              />
                            </div>
                            <span className="font-semibold text-emerald-600">
                              {matchPercent}% sesuai prioritasmu
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-400">
                              Unggul di {topContributors(result).join(" & ")}
                            </span>
                          </div>
                        )}

                        {/* HARGA & CTA */}
                        <div className="mt-auto pt-4 flex items-end justify-between gap-3">
                          <div>
                            <p className="text-[11px] text-slate-400">Mulai dari</p>
                            <p className="text-xl font-bold text-sky-600">
                              Rp {hotel.nilai.harga.toLocaleString("id-ID")}
                              <span className="text-xs font-normal text-slate-500">/malam</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {result && (
                              <button
                                onClick={() =>
                                  setExpandedId(expandedId === hotel.id ? null : hotel.id)
                                }
                                className="text-xs font-semibold text-slate-400 hover:text-sky-600 flex items-center gap-1"
                              >
                                Rincian penilaian
                                {expandedId === hotel.id ? (
                                  <FaChevronUp size={9} />
                                ) : (
                                  <FaChevronDown size={9} />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => navigate(`/hotel/${hotel.id}`)}
                              className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-sky-500/20"
                            >
                              Lihat Kamar
                            </button>
                          </div>
                        </div>

                        {/* DETAIL SAW (opsional, ringkas) */}
                        {result && expandedId === hotel.id && (
                          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
                            {CRITERIA_KEYS.map((key) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-slate-500">{CRITERIA_LABEL[key]}</span>
                                <span className="font-semibold text-slate-700 flex items-center gap-1">
                                  <FaCheckCircle className="text-emerald-400" size={10} />
                                  {key === "harga"
                                    ? `Rp ${hotel.nilai[key].toLocaleString("id-ID")}`
                                    : key === "jarak"
                                    ? `${hotel.nilai[key]} km`
                                    : key === "fasilitas"
                                    ? `${hotel.nilai[key]} item`
                                    : hotel.nilai[key].toFixed(1)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
