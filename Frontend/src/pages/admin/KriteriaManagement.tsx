import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { useAdminStore } from '../../store/adminStore';
import type { Kriteria } from '../../types/spk';

type KriteriaForm = Omit<Kriteria, 'id_kriteria'>;

const emptyForm: KriteriaForm = {
  kode: '', nama: '', key: 'harga', tipe: 'cost', bobot: 10,
};

export default function KriteriaManagement() {
  const { kriterias, addKriteria, updateKriteria, deleteKriteria } = useAdminStore();
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; id?: number }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<KriteriaForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const totalBobot = kriterias.reduce((s, k) => s + k.bobot, 0);

  const openAdd = () => { setForm(emptyForm); setModal({ open: true, mode: 'add' }); };
  const openEdit = (k: Kriteria) => {
    const { id_kriteria, ...rest } = k;
    setForm(rest);
    setModal({ open: true, mode: 'edit', id: id_kriteria });
  };
  const handleSave = () => {
    if (!form.kode || !form.nama) return;
    if (modal.mode === 'add') addKriteria(form);
    else if (modal.id) updateKriteria(modal.id, form);
    setModal({ open: false, mode: 'add' });
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Kriteria & Bobot SAW</h2>
          <p className="text-slate-500 text-sm">{kriterias.length} kriteria · Total bobot:{' '}
            <span className={`font-bold ${totalBobot === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {totalBobot}%
            </span>
            {totalBobot !== 100 && <span className="text-amber-500 text-xs ml-1">(harus 100%)</span>}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-sky-500/20"
        >
          <FaPlus size={11} /> Tambah Kriteria
        </button>
      </div>

      {/* Total bobot warning */}
      {totalBobot !== 100 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
          <FaInfoCircle className="shrink-0" />
          Total bobot saat ini <strong>{totalBobot}%</strong>. Untuk perhitungan SAW yang akurat, pastikan total bobot = 100%.
        </div>
      )}

      {/* Bobot visualization */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Distribusi Bobot</p>
        <div className="flex h-5 rounded-full overflow-hidden gap-0.5">
          {kriterias.map((k, i) => {
            const colors = [
              'bg-sky-500', 'bg-cyan-500', 'bg-indigo-500',
              'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
            ];
            return (
              <div
                key={k.id_kriteria}
                className={`${colors[i % colors.length]} transition-all duration-500`}
                style={{ width: `${k.bobot}%` }}
                title={`${k.nama}: ${k.bobot}%`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {kriterias.map((k, i) => {
            const colors = ['text-sky-600', 'text-cyan-600', 'text-indigo-600', 'text-emerald-600', 'text-amber-600', 'text-rose-600'];
            const dots = ['bg-sky-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
            return (
              <div key={k.id_kriteria} className="flex items-center gap-1.5 text-xs">
                <div className={`w-2.5 h-2.5 rounded-full ${dots[i % dots.length]}`} />
                <span className="text-slate-500">{k.nama}</span>
                <span className={`font-bold ${colors[i % colors.length]}`}>{k.bobot}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Kode</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Nama Kriteria</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Key</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Tipe</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Bobot</th>
              <th className="text-right px-5 py-3.5 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kriterias.map((k) => (
              <tr key={k.id_kriteria} className="border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="px-5 py-3.5">
                  <span className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg text-xs">{k.kode}</span>
                </td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{k.nama}</td>
                <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{k.key}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    k.tipe === 'benefit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {k.tipe}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: `${k.bobot}%` }} />
                    </div>
                    <span className="font-bold text-sky-600 text-xs">{k.bobot}%</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(k)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition"><FaEdit size={13} /></button>
                    <button onClick={() => setDeleteTarget(k.id_kriteria)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"><FaTrash size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">{modal.mode === 'add' ? 'Tambah Kriteria' : 'Edit Kriteria'}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kode *</label>
                  <input
                    type="text"
                    value={form.kode}
                    onChange={(e) => setForm({ ...form, kode: e.target.value })}
                    placeholder="C7"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama *</label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Nama kriteria"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tipe</label>
                  <select
                    value={form.tipe}
                    onChange={(e) => setForm({ ...form, tipe: e.target.value as 'benefit' | 'cost' })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 bg-white"
                  >
                    <option value="benefit">benefit (↑ lebih baik)</option>
                    <option value="cost">cost (↓ lebih baik)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bobot (%) *</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.bobot}
                    onChange={(e) => setForm({ ...form, bobot: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModal({ open: false, mode: 'add' })} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Batal</button>
              <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition shadow-md shadow-sky-500/20">
                {modal.mode === 'add' ? 'Tambah' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4 text-xl"><FaExclamationTriangle /></div>
            <h3 className="font-bold text-slate-800 text-lg">Hapus Kriteria?</h3>
            <p className="text-slate-500 text-sm mt-2">Kriteria <span className="font-semibold text-slate-700">{kriterias.find((k) => k.id_kriteria === deleteTarget)?.nama}</span> akan dihapus permanen.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Batal</button>
              <button onClick={() => { deleteKriteria(deleteTarget); setDeleteTarget(null); }} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
