import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAdminStore } from '../../store/adminStore';
import type { PerbandinganKriteria } from '../../store/adminStore';

const AHP_SCALE = [
  { value: 1, label: '1 – Sama penting' },
  { value: 2, label: '2 – Sedikit lebih penting' },
  { value: 3, label: '3 – Lebih penting' },
  { value: 4, label: '4 – Jauh lebih penting' },
  { value: 5, label: '5 – Sangat lebih penting' },
  { value: 6, label: '6 – Antara 5 dan 7' },
  { value: 7, label: '7 – Jauh lebih sangat penting' },
  { value: 8, label: '8 – Antara 7 dan 9' },
  { value: 9, label: '9 – Mutlak lebih penting' },
];

export default function PerbandinganAHP() {
  const { kriterias, perbandinganKriterias, addPerbandingan, updatePerbandingan, deletePerbandingan } = useAdminStore();
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; id?: number }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<Omit<PerbandinganKriteria, 'id'>>({
    kriteria1Id: kriterias[0]?.id_kriteria ?? 0,
    kriteria2Id: kriterias[1]?.id_kriteria ?? 0,
    nilai: 1,
  });
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const openAdd = () => {
    setForm({ kriteria1Id: kriterias[0]?.id_kriteria ?? 0, kriteria2Id: kriterias[1]?.id_kriteria ?? 0, nilai: 1 });
    setModal({ open: true, mode: 'add' });
  };
  const openEdit = (p: PerbandinganKriteria) => {
    const { id, ...rest } = p;
    setForm(rest);
    setModal({ open: true, mode: 'edit', id });
  };
  const handleSave = () => {
    if (modal.mode === 'add') addPerbandingan(form);
    else if (modal.id) updatePerbandingan(modal.id, form);
    setModal({ open: false, mode: 'add' });
  };

  const getName = (id: number) => kriterias.find((k) => k.id_kriteria === id)?.nama ?? '-';
  const getKode = (id: number) => kriterias.find((k) => k.id_kriteria === id)?.kode ?? '-';

  // Build matrix data from perbandinganKriterias
  const matrixMap = new Map<string, number>();
  perbandinganKriterias.forEach((p) => {
    matrixMap.set(`${p.kriteria1Id}-${p.kriteria2Id}`, p.nilai);
    matrixMap.set(`${p.kriteria2Id}-${p.kriteria1Id}`, p.nilai > 0 ? 1 / p.nilai : 0);
  });

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Perbandingan Kriteria (AHP)</h2>
          <p className="text-slate-500 text-sm">{perbandinganKriterias.length} pasang perbandingan</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-sky-500/20"
        >
          <FaPlus size={11} /> Tambah Perbandingan
        </button>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-sm text-sky-700">
        <FaInfoCircle className="shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Metode AHP (Analytic Hierarchy Process)</p>
          <p className="text-xs text-sky-600 mt-0.5">
            Bandingkan kepentingan relatif antar kriteria menggunakan skala 1-9 Saaty. Diagonal matriks bernilai 1 (kriteria dibanding dirinya sendiri). Nilai kebalikan (1/n) dihitung otomatis.
          </p>
        </div>
      </div>

      {/* AHP Matrix Visualization */}
      {kriterias.length > 0 && perbandinganKriterias.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 overflow-x-auto">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Matriks Perbandingan</p>
          <table className="text-xs border-collapse">
            <thead>
              <tr>
                <th className="w-24 px-3 py-2 text-slate-400"></th>
                {kriterias.map((k) => (
                  <th key={k.id_kriteria} className="px-3 py-2 font-bold text-sky-600 text-center whitespace-nowrap bg-sky-50 rounded-lg">
                    {k.kode}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kriterias.map((r) => (
                <tr key={r.id_kriteria}>
                  <td className="px-3 py-2 font-bold text-sky-600 bg-sky-50 rounded-lg whitespace-nowrap">{r.kode}</td>
                  {kriterias.map((c) => {
                    const val = r.id_kriteria === c.id_kriteria ? 1 : matrixMap.get(`${r.id_kriteria}-${c.id_kriteria}`);
                    return (
                      <td key={c.id_kriteria} className={`px-3 py-2 text-center font-semibold border border-slate-50 ${
                        r.id_kriteria === c.id_kriteria ? 'text-slate-400 bg-slate-50' : val !== undefined ? 'text-slate-700' : 'text-slate-200'
                      }`}>
                        {val !== undefined ? (Number.isInteger(val) ? val : val.toFixed(2)) : '–'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Perbandingan List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Kriteria 1</th>
              <th className="text-center px-5 py-3.5 font-semibold text-slate-600">Nilai</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Kriteria 2</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Arti</th>
              <th className="text-right px-5 py-3.5 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {perbandinganKriterias.map((p) => {
              const scale = AHP_SCALE.find((s) => s.value === p.nilai);
              return (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg text-xs mr-2">{getKode(p.kriteria1Id)}</span>
                    {getName(p.kriteria1Id)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-bold text-lg flex items-center justify-center mx-auto">
                      {p.nilai}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg text-xs mr-2">{getKode(p.kriteria2Id)}</span>
                    {getName(p.kriteria2Id)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{scale?.label ?? '-'}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition"><FaEdit size={13} /></button>
                      <button onClick={() => setDeleteTarget(p.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"><FaTrash size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {perbandinganKriterias.length === 0 && (
              <tr><td colSpan={5} className="text-center py-14 text-slate-400">Belum ada data perbandingan AHP</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">{modal.mode === 'add' ? 'Tambah Perbandingan' : 'Edit Perbandingan'}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kriteria 1</label>
                <select
                  value={form.kriteria1Id}
                  onChange={(e) => setForm({ ...form, kriteria1Id: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 bg-white"
                >
                  {kriterias.map((k) => <option key={k.id_kriteria} value={k.id_kriteria}>{k.kode} – {k.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kriteria 2</label>
                <select
                  value={form.kriteria2Id}
                  onChange={(e) => setForm({ ...form, kriteria2Id: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 bg-white"
                >
                  {kriterias.map((k) => <option key={k.id_kriteria} value={k.id_kriteria}>{k.kode} – {k.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nilai Perbandingan (Skala Saaty 1-9)</label>
                <select
                  value={form.nilai}
                  onChange={(e) => setForm({ ...form, nilai: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 bg-white"
                >
                  {AHP_SCALE.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
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
            <h3 className="font-bold text-slate-800 text-lg">Hapus Perbandingan?</h3>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600">Batal</button>
              <button onClick={() => { deletePerbandingan(deleteTarget); setDeleteTarget(null); }} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
