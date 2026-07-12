import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { useAdminStore } from '../../store/adminStore';
import type { AdminSubKriteria } from '../../store/adminStore';

export default function SubKriteriaManagement() {
  const { subKriterias, kriterias, addSubKriteria, updateSubKriteria, deleteSubKriteria } = useAdminStore();
  const [filterKriteria, setFilterKriteria] = useState<number | ''>('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; id?: number }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<Omit<AdminSubKriteria, 'id'>>({ kriteriaId: kriterias[0]?.id_kriteria ?? 1, value: '', skor: 1 });
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const filtered = filterKriteria === ''
    ? subKriterias
    : subKriterias.filter((s) => s.kriteriaId === filterKriteria);

  const openAdd = () => {
    setForm({ kriteriaId: kriterias[0]?.id_kriteria ?? 1, value: '', skor: 1 });
    setModal({ open: true, mode: 'add' });
  };
  const openEdit = (s: AdminSubKriteria) => {
    const { id, ...rest } = s;
    setForm(rest);
    setModal({ open: true, mode: 'edit', id });
  };
  const handleSave = () => {
    if (!form.value.trim()) return;
    if (modal.mode === 'add') addSubKriteria(form);
    else if (modal.id) updateSubKriteria(modal.id, form);
    setModal({ open: false, mode: 'add' });
  };

  const getKriteriaName = (id: number) => kriterias.find((k) => k.id_kriteria === id)?.nama ?? '-';

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sub Kriteria</h2>
          <p className="text-slate-500 text-sm">{subKriterias.length} sub kriteria terdaftar</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-sky-500/20"
        >
          <FaPlus size={11} /> Tambah Sub Kriteria
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-500">Filter kriteria:</span>
        <button
          onClick={() => setFilterKriteria('')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${filterKriteria === '' ? 'bg-sky-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-300'}`}
        >
          Semua
        </button>
        {kriterias.map((k) => (
          <button
            key={k.id_kriteria}
            onClick={() => setFilterKriteria(k.id_kriteria)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${filterKriteria === k.id_kriteria ? 'bg-sky-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-300'}`}
          >
            {k.kode} – {k.nama}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">ID</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Kriteria</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Nilai / Deskripsi</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Skor</th>
              <th className="text-right px-5 py-3.5 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">#{s.id}</td>
                <td className="px-5 py-3.5">
                  <span className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg text-xs">
                    {kriterias.find((k) => k.id_kriteria === s.kriteriaId)?.kode ?? '?'}
                  </span>
                  <span className="ml-2 text-slate-600 text-xs">{getKriteriaName(s.kriteriaId)}</span>
                </td>
                <td className="px-5 py-3.5 text-slate-700 font-medium">{s.value}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">{s.skor}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(s)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition"><FaEdit size={13} /></button>
                    <button onClick={() => setDeleteTarget(s.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"><FaTrash size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-slate-400">Tidak ada data sub kriteria</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">{modal.mode === 'add' ? 'Tambah Sub Kriteria' : 'Edit Sub Kriteria'}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kriteria</label>
                <select
                  value={form.kriteriaId}
                  onChange={(e) => setForm({ ...form, kriteriaId: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 bg-white"
                >
                  {kriterias.map((k) => (
                    <option key={k.id_kriteria} value={k.id_kriteria}>{k.kode} – {k.nama}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nilai / Deskripsi *</label>
                <input
                  type="text"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="Contoh: Sangat Mahal (> Rp500.000)"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Skor (1-5) *</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.skor}
                  onChange={(e) => setForm({ ...form, skor: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModal({ open: false, mode: 'add' })} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
              <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition shadow-md shadow-sky-500/20">
                {modal.mode === 'add' ? 'Tambah' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4 text-xl"><FaExclamationTriangle /></div>
            <h3 className="font-bold text-slate-800 text-lg">Hapus Sub Kriteria?</h3>
            <p className="text-slate-500 text-sm mt-2">Data ini akan dihapus permanen.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600">Batal</button>
              <button onClick={() => { deleteSubKriteria(deleteTarget); setDeleteTarget(null); }} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
