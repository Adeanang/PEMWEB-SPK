import {
  FaHotel,
  FaUsers,
  FaBalanceScale,
  FaHistory,
  FaBed,
  FaConciergeBell,
  FaStar,
  FaTrophy,
  FaArrowUp,
  FaLayerGroup,
} from 'react-icons/fa';
import { useAdminStore } from '../../store/adminStore';
import { computeSAW } from '../../utils/saw';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  iconBg: string;
  trend?: string;
}

function StatCard({ label, value, icon, bgColor, textColor, iconBg, trend }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center text-lg`}>
          {icon}
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full">
            <FaArrowUp size={8} /> {trend}
          </span>
        )}
      </div>
      <p className={`text-3xl font-bold ${textColor} mt-4`}>{value}</p>
      <p className="text-slate-500 text-xs font-medium mt-1">{label}</p>
    </div>
  );
}

export default function Overview() {
  const {
    hotels, users, kriterias, rekomendasiRequests,
    kamars, fasilitasHotels, kategoriHotels, subKriterias,
  } = useAdminStore();

  const topPicks = computeSAW(hotels, kriterias).slice(0, 5);

  const stats: StatCardProps[] = [
    {
      label: 'Total Hotel', value: hotels.length, icon: <FaHotel className="text-sky-600" />,
      bgColor: 'bg-white', textColor: 'text-slate-800', iconBg: 'bg-sky-100',
    },
    {
      label: 'Kategori Hotel', value: kategoriHotels.length, icon: <FaLayerGroup className="text-cyan-600" />,
      bgColor: 'bg-white', textColor: 'text-slate-800', iconBg: 'bg-cyan-100',
    },
    {
      label: 'Total Kamar', value: kamars.length, icon: <FaBed className="text-indigo-600" />,
      bgColor: 'bg-white', textColor: 'text-slate-800', iconBg: 'bg-indigo-100',
    },
    {
      label: 'Fasilitas Tercatat', value: fasilitasHotels.length, icon: <FaConciergeBell className="text-amber-600" />,
      bgColor: 'bg-white', textColor: 'text-slate-800', iconBg: 'bg-amber-100',
    },
    {
      label: 'Kriteria SPK', value: kriterias.length, icon: <FaBalanceScale className="text-emerald-600" />,
      bgColor: 'bg-white', textColor: 'text-slate-800', iconBg: 'bg-emerald-100',
    },
    {
      label: 'Sub Kriteria', value: subKriterias.length, icon: <FaLayerGroup className="text-violet-600" />,
      bgColor: 'bg-white', textColor: 'text-slate-800', iconBg: 'bg-violet-100',
    },
    {
      label: 'Total User', value: users.length, icon: <FaUsers className="text-rose-600" />,
      bgColor: 'bg-white', textColor: 'text-slate-800', iconBg: 'bg-rose-100',
    },
    {
      label: 'Total Rekomendasi', value: rekomendasiRequests.length, icon: <FaHistory className="text-orange-600" />,
      bgColor: 'bg-white', textColor: 'text-slate-800', iconBg: 'bg-orange-100',
      trend: '+3 bulan ini',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Selamat Datang</h2>
        <p className="text-slate-500 text-sm mt-1">
          Ringkasan data sistem rekomendasi hotel WisTel — Kota Tegal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Rekomendasi SAW */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <FaTrophy className="text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Top 5 Rekomendasi SAW</h3>
              <p className="text-xs text-slate-400">Berdasarkan bobot kriteria saat ini</p>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {topPicks.map((r, i) => {
              const kategori = kategoriHotels.find((k) => k.id === r.hotel.id_kategori_hotel);
              const pct = Math.round(Math.min(r.score, 1) * 100);
              return (
                <div key={r.hotel.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      i === 0
                        ? 'bg-amber-400 text-white'
                        : i === 1
                        ? 'bg-slate-300 text-slate-700'
                        : i === 2
                        ? 'bg-orange-300 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {r.ranking}
                  </span>
                  <img
                    src={r.hotel.image_hotel}
                    alt={r.hotel.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{r.hotel.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">{r.hotel.location}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 font-medium">
                        {kategori?.nama_kategori}
                      </span>
                    </div>
                    {/* Score bar */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-sky-600 shrink-0">{pct}%</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-amber-500 justify-end">
                      <FaStar size={11} />
                      <span className="text-slate-700 text-sm font-semibold">{r.hotel.nilai.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Rp {(r.hotel.nilai.harga / 1000).toFixed(0)}k</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Distribusi Bobot Kriteria */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Bobot Kriteria SAW</h3>
            <div className="space-y-3">
              {kriterias.map((k) => (
                <div key={k.id_kriteria}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600">{k.nama}</span>
                    <span className="font-bold text-sky-600">{k.bobot}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"
                      style={{ width: `${k.bobot}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Rekomendasi */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Rekomendasi Terbaru</h3>
            <div className="space-y-2.5">
              {rekomendasiRequests
                .slice()
                .reverse()
                .slice(0, 5)
                .map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-[10px]">
                        {r.userId ? 'U' : 'G'}
                      </div>
                      <span className="text-slate-600 font-medium">
                        {r.userId ? `User #${r.userId}` : 'Guest'}
                      </span>
                    </div>
                    <span className="text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short',
                      })}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
