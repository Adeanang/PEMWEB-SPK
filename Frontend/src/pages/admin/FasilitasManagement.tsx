import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import { useAdminStore } from '../../store/adminStore';
import type { FasilitasHotel } from '../../store/adminStore';

export default function FasilitasManagement() {
  const { hotels, fasilitasHotels, addFasilitas, updateFasilitas, deleteFasilitas } = useAdminStore();
  const [filterHotel, setFilterHotel] = useState<number | ''>('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; id?: number }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<Omit<FasilitasHotel, 'id'>>({ hotelId: hotels[0]?.id ?? 0, fasilitas: '' });
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const filtered = fasilitasHotels.filter((f) => {
    const matchHotel = filterHotel === '' || f.hotelId === filterHotel;
    const matchSearch = search.trim() === '' || f.fasilitas.toLowerCase().includes(search.toLowerCase());
    return matchHotel && matchSearch;
  });

  const openAdd = () => { setForm({ hotelId: hotels[0]?.id ?? 0, fasilitas: '' }); setModal({ open: true, mode: 'add' }); };
  const openEdit = (f: FasilitasHotel) => { const { id, ...rest } = f; setForm(rest); setModal({ open: true, mode: 'edit', id }); };
  const handleSave = () => {
    if (!form.fasilitas.trim()) return;
    if (modal.mode === 'add') addFasilitas(form);
    else if (modal.id) updateFasilitas(modal.id, form);
    setModal({ open: false, mode: 'add' });
  };
  const getHotelName = (id: number) => hotels.find((h) => h.id === id)?.name ?? '-';

  // Unique fasilitas count per hotel
  const fasilitasPerHotel = hotels.map((h) => ({
    hotel: h,
    count: fasilitasHotels.filter((f) => f.hotelId === h.id).length,
  }));

  // Unique fasilitas names
  const uniqueFasilitas = [...new Set(fasilitasHotels.map((f) => f.fasilitas))];

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Fasilitas Hotel</h2>
          <p className="text-slate-500 text-sm">{fasilitasHotels.length} fasilitas · {uniqueFasilitas.length} jenis unik</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-sky-500/20"
        >
          <FaPlus size={11} /> Tambah Fasilitas
        </button>
      </div>

      {/* Stat cards per hotel */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {fasilitasPerHotel.map(({ hotel, count }) => (
          <button
            key={hotel.id}
            onClick={() => setFilterHotel(filterHotel === hotel.id ? '' : hotel.id)}
            className={`bg-white rounded-2xl border p-4 text-left transition hover:shadow-md ${
              filterHotel === hotel.id ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-100'
            }`}
          >
            <p className="font-semibold text-slate-800 text-sm truncate">{hotel.name}</p>
            <p className="text-2xl font-bold text-sky-600 mt-1">{count}</p>
            <p className="text-xs text-slate-400">fasilitas</p>
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari fasilitas..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
        </div>
        <select
          value={filterHotel}
          onChange={(e) => setFilterHotel(e.target.value === '' ? '' : Number(e.target.value))}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-sky-400"
        >
          <option value="">Semua Hotel</option>
          {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
        {(filterHotel !== '' || search) && (
          <button onClick={() => { setFilterHotel(''); setSearch(''); }} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50">Reset</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">ID</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Hotel</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Fasilitas</th>
              <th className="text-right px-5 py-3.5 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">#{f.id}</td>
                <td className="px-5 py-3.5 text-slate-600 font-medium">{getHotelName(f.hotelId)}</td>
                <td className="px-5 py-3.5">
                  <span className="px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-100">{f.fasilitas}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(f)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition"><FaEdit size={13} /></button>
                    <button onClick={() => setDeleteTarget(f.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"><FaTrash size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="text-center py-12 text-slate-400">Tidak ada fasilitas ditemukan</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">{modal.mode === 'add' ? 'Tambah Fasilitas' : 'Edit Fasilitas'}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hotel</label>
                <select value={form.hotelId} onChange={(e) => setForm({ ...form, hotelId: Number(e.target.value) })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 bg-white">
                  {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Fasilitas *</label>
                <input type="text" value={form.fasilitas} onChange={(e) => setForm({ ...form, fasilitas: e.target.value })} placeholder="Wifi Gratis, Kolam Renang..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
                {uniqueFasilitas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {uniqueFasilitas.slice(0, 8).map((f) => (
                      <button key={f} onClick={() => setForm({ ...form, fasilitas: f })} className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-sky-100 hover:text-sky-700 transition">{f}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModal({ open: false, mode: 'add' })} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
              <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition shadow-md shadow-sky-500/20">{modal.mode === 'add' ? 'Tambah' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4 text-xl"><FaExclamationTriangle /></div>
            <h3 className="font-bold text-slate-800 text-lg">Hapus Fasilitas?</h3>
            <p className="text-slate-500 text-sm mt-2">Fasilitas <span className="font-semibold text-slate-700">{fasilitasHotels.find((f) => f.id === deleteTarget)?.fasilitas}</span> akan dihapus.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600">Batal</button>
              <button onClick={() => { deleteFasilitas(deleteTarget); setDeleteTarget(null); }} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
