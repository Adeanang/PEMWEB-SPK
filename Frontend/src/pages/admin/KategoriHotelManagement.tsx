import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import { useAdminStore } from '../../store/adminStore';
import type { KategoriHotel } from '../../types/spk';

export default function KategoriHotelManagement() {
  const { kategoriHotels, hotels, addKategoriHotel, updateKategoriHotel, deleteKategoriHotel } = useAdminStore();
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; id?: number }>({ open: false, mode: 'add' });
  const [form, setForm] = useState({ nama_kategori: '' });
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const openAdd = () => { setForm({ nama_kategori: '' }); setModal({ open: true, mode: 'add' }); };
  const openEdit = (k: KategoriHotel) => {
    setForm({ nama_kategori: k.nama_kategori });
    setModal({ open: true, mode: 'edit', id: k.id });
  };
  const handleSave = async () => {
    if (!form.nama_kategori.trim()) return;
    setIsSaving(true);
    try {
      if (modal.mode === 'add') await addKategoriHotel({ nama_kategori: form.nama_kategori, deskripsi: '' });
      else if (modal.id) await updateKategoriHotel(modal.id, { nama_kategori: form.nama_kategori, deskripsi: '' });
      setModal({ open: false, mode: 'add' });
    } finally {
      setIsSaving(false);
    }
  };

  const bintangCount = (nama: string) => Number(nama.replace(/\D/g, '')) || 0;

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Kategori Hotel</h2>
          <p className="text-slate-500 text-sm">{kategoriHotels.length} kategori terdaftar</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-sky-500/20"
        >
          <FaPlus size={11} /> Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">ID</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Nama Kategori</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Bintang</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Jumlah Hotel</th>
              <th className="text-right px-5 py-3.5 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kategoriHotels.map((k) => {
              const count = hotels.filter((h) => h.id_kategori_hotel === k.id).length;
              const stars = bintangCount(k.nama_kategori);
              return (
                <tr key={k.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">#{k.id}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{k.nama_kategori}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: stars }).map((_, i) => (
                        <FaStar key={i} size={13} className="text-amber-400" />
                      ))}
                      {Array.from({ length: 5 - stars }).map((_, i) => (
                        <FaStar key={i} size={13} className="text-slate-200" />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                      {count} hotel
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(k)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition">
                        <FaEdit size={13} />
                      </button>
                      <button onClick={() => setDeleteTarget(k.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition">
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">
                {modal.mode === 'add' ? 'Tambah Kategori Hotel' : 'Edit Kategori Hotel'}
              </h3>
            </div>
            <div className="p-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Kategori *</label>
              <input
                type="text"
                value={form.nama_kategori}
                onChange={(e) => setForm({ nama_kategori: e.target.value })}
                placeholder="Contoh: Bintang 3"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                autoFocus
              />
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModal({ open: false, mode: 'add' })} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                Batal
              </button>
              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-sm font-semibold transition shadow-md shadow-sky-500/20">
                {isSaving ? 'Menyimpan...' : modal.mode === 'add' ? 'Tambah' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4 text-xl">
              <FaExclamationTriangle />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Hapus Kategori?</h3>
            <p className="text-slate-500 text-sm mt-2">
              Kategori <span className="font-semibold text-slate-700">{kategoriHotels.find((k) => k.id === deleteTarget)?.nama_kategori}</span> akan dihapus permanen.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Batal</button>
              <button onClick={async () => {
                setIsSaving(true);
                try {
                  if (deleteTarget !== null) {
                    await deleteKategoriHotel(deleteTarget);
                  }
                  setDeleteTarget(null);
                } finally {
                  setIsSaving(false);
                }
              }} disabled={isSaving} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-semibold transition">
                {isSaving ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
