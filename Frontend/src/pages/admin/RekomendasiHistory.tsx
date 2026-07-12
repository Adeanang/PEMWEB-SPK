import { useState } from 'react';
import { FaHistory, FaSearch, FaFilter } from 'react-icons/fa';
import { useAdminStore } from '../../store/adminStore';

export default function RekomendasiHistory() {
  const { rekomendasiRequests, users, kategoriHotels } = useAdminStore();
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState<number | ''>('');

  const filtered = rekomendasiRequests.filter((r) => {
    const matchSearch =
      search.trim() === '' ||
      String(r.id).includes(search) ||
      (r.userId ? users.find((u) => u.id === r.userId)?.email?.toLowerCase().includes(search.toLowerCase()) : false);
    const matchKategori = filterKategori === '' || r.kategoriHotelId === filterKategori;
    return matchSearch && matchKategori;
  });

  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getKategoriName = (id: number | null) =>
    id ? kategoriHotels.find((k) => k.id === id)?.nama_kategori ?? '-' : '-';
  const getUserEmail = (id: number | null) =>
    id ? users.find((u) => u.id === id)?.email ?? `User #${id}` : 'Guest';

  // Stats
  const thisMonth = rekomendasiRequests.filter((r) => {
    const d = new Date(r.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const guestCount = rekomendasiRequests.filter((r) => !r.userId).length;
  const memberCount = rekomendasiRequests.filter((r) => r.userId).length;

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">History Rekomendasi</h2>
        <p className="text-slate-500 text-sm">Riwayat permintaan rekomendasi oleh pengguna</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Request', value: rekomendasiRequests.length, color: 'bg-sky-50 text-sky-600', icon: <FaHistory /> },
          { label: 'Bulan Ini', value: thisMonth, color: 'bg-emerald-50 text-emerald-600', icon: <FaHistory /> },
          { label: 'Oleh Member', value: memberCount, color: 'bg-violet-50 text-violet-600', icon: <FaHistory /> },
          { label: 'Oleh Guest', value: guestCount, color: 'bg-amber-50 text-amber-600', icon: <FaHistory /> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center text-base mb-3`}>{s.icon}</div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ID atau email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value === '' ? '' : Number(e.target.value))}
            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-400 appearance-none"
          >
            <option value="">Semua Kategori</option>
            {kategoriHotels.map((k) => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">ID</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Pengguna</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Kategori Hotel</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Tanggal & Waktu</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const date = new Date(r.createdAt);
              return (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg text-xs">#{r.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${r.userId ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-500'}`}>
                        {r.userId ? getUserEmail(r.userId)[0].toUpperCase() : 'G'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-xs">{getUserEmail(r.userId)}</p>
                        <p className="text-[10px] text-slate-400">{r.userId ? 'Member' : 'Guest'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">{getKategoriName(r.kategoriHotelId)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-slate-700 text-xs font-medium">
                      {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-slate-400 text-[10px]">
                      {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Selesai
                    </span>
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr><td colSpan={5} className="text-center py-14 text-slate-400">Tidak ada riwayat rekomendasi ditemukan</td></tr>
            )}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400">
          Menampilkan {sorted.length} dari {rekomendasiRequests.length} rekomendasi
        </div>
      </div>
    </div>
  );
}
