import { useState } from 'react';
import { FaEdit, FaPlus, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { useAdminStore } from '../../store/adminStore';
import type { HotelKriteria } from '../../store/adminStore';

export default function HotelKriteriaManagement() {
  const { hotels, kriterias, hotelKriterias, addHotelKriteria, updateHotelKriteria, deleteHotelKriteria } = useAdminStore();
  const [selectedHotel, setSelectedHotel] = useState<number>(hotels[0]?.id ?? 0);
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; id?: number }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<Omit<HotelKriteria, 'id'>>({ hotelId: hotels[0]?.id ?? 0, kriteriaId: kriterias[0]?.id_kriteria ?? 0, nilai: 0 });
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentHotel = hotels.find((h) => h.id === selectedHotel);
  const kriteriaForHotel = hotelKriterias.filter((hk) => hk.hotelId === selectedHotel);

  const openAdd = () => {
    setForm({ hotelId: selectedHotel, kriteriaId: kriterias[0]?.id_kriteria ?? 0, nilai: 0 });
    setModal({ open: true, mode: 'add' });
  };
  const openEdit = (hk: HotelKriteria) => {
    const { id, ...rest } = hk;
    setForm(rest);
    setModal({ open: true, mode: 'edit', id });
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (modal.mode === 'add') await addHotelKriteria(form);
      else if (modal.id) await updateHotelKriteria(modal.id, form);
      setModal({ open: false, mode: 'add' });
    } finally { setIsSaving(false); }
  };

  const getKriteriaName = (id: number) => kriterias.find((k) => k.id_kriteria === id)?.nama ?? '-';
  const getKriteriaKode = (id: number) => kriterias.find((k) => k.id_kriteria === id)?.kode ?? '-';

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Nilai Hotel (Hotel Kriteria)</h2>
        <p className="text-slate-500 text-sm">Kelola nilai setiap kriteria per hotel untuk perhitungan SAW</p>
      </div>

      {/* Hotel Selector */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Pilih Hotel</p>
        <div className="flex flex-wrap gap-2">
          {hotels.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHotel(h.id)}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                selectedHotel === h.id
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-sky-300'
              }`}
            >
              {h.image_hotel && (
                <img src={h.image_hotel} alt="" className="w-5 h-5 rounded-md object-cover" />
              )}
              {h.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Hotel Info + Actions */}
      {currentHotel && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {currentHotel.image_hotel && (
              <img src={currentHotel.image_hotel} alt={currentHotel.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
            )}
            <div>
              <p className="font-bold text-slate-800">{currentHotel.name}</p>
              <p className="text-xs text-slate-400">{currentHotel.location} · {kriteriaForHotel.length} kriteria dinilai</p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-sky-500/20"
          >
            <FaPlus size={11} /> Tambah Nilai
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Kriteria</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Tipe</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Nilai</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Bobot</th>
              <th className="text-right px-5 py-3.5 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kriteriaForHotel.map((hk) => {
              const k = kriterias.find((kr) => kr.id_kriteria === hk.kriteriaId);
              const formatNilai = () => {
                if (!k) return hk.nilai;
                if (k.key === 'harga') return `Rp ${hk.nilai.toLocaleString('id-ID')}`;
                if (k.key === 'jarak') return `${hk.nilai} km`;
                if (k.key === 'fasilitas') return `${hk.nilai} item`;
                return hk.nilai.toFixed(1);
              };
              return (
                <tr key={hk.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg text-xs">{getKriteriaKode(hk.kriteriaId)}</span>
                      <span className="font-medium text-slate-800">{getKriteriaName(hk.kriteriaId)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      k?.tipe === 'benefit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {k?.tipe ?? '-'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-800">{formatNilai()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${k?.bobot ?? 0}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{k?.bobot ?? 0}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(hk)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition"><FaEdit size={13} /></button>
                      <button onClick={() => setDeleteTarget(hk.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"><FaTrash size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {kriteriaForHotel.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-slate-400">Belum ada nilai kriteria untuk hotel ini</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">{modal.mode === 'add' ? 'Tambah Nilai Kriteria' : 'Edit Nilai Kriteria'}</h3>
              <p className="text-slate-400 text-xs mt-0.5">Hotel: {currentHotel?.name}</p>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nilai</label>
                <input
                  type="number"
                  value={form.nilai}
                  step={0.1}
                  onChange={(e) => setForm({ ...form, nilai: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Harga dalam Rp, Jarak dalam km, Rating/Kebersihan/Pelayanan skala 1-5, Fasilitas dalam jumlah item
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModal({ open: false, mode: 'add' })} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-sm font-semibold transition shadow-md shadow-sky-500/20">
                {isSaving ? 'Menyimpan...' : modal.mode === 'add' ? 'Tambah' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4 text-xl"><FaExclamationTriangle /></div>
            <h3 className="font-bold text-slate-800 text-lg">Hapus Nilai Kriteria?</h3>
            <p className="text-slate-500 text-sm mt-2">Data ini akan dihapus permanen.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600">Batal</button>
              <button onClick={async () => {
                setIsSaving(true);
                try {
                  if (deleteTarget !== null) await deleteHotelKriteria(deleteTarget);
                  setDeleteTarget(null);
                } finally { setIsSaving(false); }
              }} disabled={isSaving} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
