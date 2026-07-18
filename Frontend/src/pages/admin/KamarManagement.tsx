import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { useAdminStore } from '../../store/adminStore';
import type { KategoriKamar } from '../../store/adminStore';


export default function KamarManagement() {
  const { hotels, kategoriKamars, kamars, addKategoriKamar, updateKategoriKamar, deleteKategoriKamar, addKamar, updateKamar, deleteKamar } = useAdminStore();
  const [activeTab, setActiveTab] = useState<'kategori' | 'kamar'>('kategori');
  const [selectedHotel, setSelectedHotel] = useState<number>(hotels[0]?.id ?? 0);

  // Kategori Kamar state 
  const [kategoriModal, setKategoriModal] = useState<{ open: boolean; mode: 'add' | 'edit'; id?: number }>({ open: false, mode: 'add' });
  const [kategoriForm, setKategoriForm] = useState<Omit<KategoriKamar, 'id'>>({ hotelId: hotels[0]?.id ?? 0, namaKategori: '', deskripsi: '', kapasitasOrang: '2' });
  const [kategoriDelete, setKategoriDelete] = useState<number | null>(null);

  // Kamar state
  const [kamarModal, setKamarModal] = useState<{ open: boolean; mode: 'add' | 'edit'; id?: number }>({ open: false, mode: 'add' });
  const [kamarForm, setKamarForm] = useState({ hotelId: hotels[0]?.id ?? 0, kategoriId: 0, nomorKamar: '' });
  const [kamarDelete, setKamarDelete] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredKategori = kategoriKamars.filter((k) => k.hotelId === selectedHotel);
  const filteredKamar = kamars.filter((k) => k.hotelId === selectedHotel);
  const availableKategori = kategoriKamars.filter((k) => k.hotelId === selectedHotel);

  

  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Kamar</h2>
        <p className="text-slate-500 text-sm">Kelola kategori kamar dan nomor kamar per hotel</p>
      </div>

      {/* Hotel Selector */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Pilih Hotel</p>
        <div className="flex flex-wrap gap-2">
          {hotels.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHotel(h.id)}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${selectedHotel === h.id ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-sky-300'}`}
            >
              {h.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(['kategori', 'kamar'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition capitalize ${activeTab === tab ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab === 'kategori' ? 'Kategori Kamar' : 'Nomor Kamar'}
          </button>
        ))}
      </div>

      {activeTab === 'kategori' && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => { setKategoriForm({ hotelId: selectedHotel, namaKategori: '', deskripsi: '', kapasitasOrang: '2' }); setKategoriModal({ open: true, mode: 'add' }); }}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-sky-500/20"
            >
              <FaPlus size={11} /> Tambah Kategori Kamar
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Nama Kategori</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Deskripsi</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Kapasitas</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredKategori.map((k) => (
                  <tr key={k.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{k.namaKategori}</td>
                    <td className="px-5 py-3.5 text-slate-500">{k.deskripsi || '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold">{k.kapasitasOrang} orang</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { const { id, ...rest } = k; setKategoriForm(rest); setKategoriModal({ open: true, mode: 'edit', id }); }} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition"><FaEdit size={13} /></button>
                        <button onClick={() => setKategoriDelete(k.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"><FaTrash size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredKategori.length === 0 && <tr><td colSpan={4} className="text-center py-12 text-slate-400">Belum ada kategori kamar</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Kamar Tab ── */}
      {activeTab === 'kamar' && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => { setKamarForm({ hotelId: selectedHotel, kategoriId: availableKategori[0]?.id ?? 0, nomorKamar: '' }); setKamarModal({ open: true, mode: 'add' }); }}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-sky-500/20"
            >
              <FaPlus size={11} /> Tambah Kamar
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">No. Kamar</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Kategori Kamar</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredKamar.map((km) => {
                  const kat = kategoriKamars.find((k) => k.id === km.kategoriId);
                  return (
                    <tr key={km.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                      <td className="px-5 py-3.5 font-bold text-slate-800 font-mono">{km.nomorKamar}</td>
                      <td className="px-5 py-3.5"><span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">{kat?.namaKategori ?? '-'}</span></td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { const { id, ...rest } = km; setKamarForm(rest); setKamarModal({ open: true, mode: 'edit', id }); }} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition"><FaEdit size={13} /></button>
                          <button onClick={() => setKamarDelete(km.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"><FaTrash size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredKamar.length === 0 && <tr><td colSpan={3} className="text-center py-12 text-slate-400">Belum ada kamar</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal Kategori */}
      {kategoriModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">{kategoriModal.mode === 'add' ? 'Tambah Kategori Kamar' : 'Edit Kategori Kamar'}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Kategori *</label>
                <input type="text" value={kategoriForm.namaKategori} onChange={(e) => setKategoriForm({ ...kategoriForm, namaKategori: e.target.value })} placeholder="Deluxe, Suite, Standard..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" /></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Deskripsi</label>
                <textarea value={kategoriForm.deskripsi} onChange={(e) => setKategoriForm({ ...kategoriForm, deskripsi: e.target.value })} rows={2} placeholder="Deskripsi singkat..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 resize-none" /></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Kapasitas Orang</label>
                <input type="text" value={kategoriForm.kapasitasOrang} onChange={(e) => setKategoriForm({ ...kategoriForm, kapasitasOrang: e.target.value })} placeholder="2" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" /></div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setKategoriModal({ open: false, mode: 'add' })} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
              <button onClick={async () => {
                setIsSaving(true);
                try {
                  if (kategoriModal.mode === 'add') await addKategoriKamar(kategoriForm);
                  else if (kategoriModal.id) await updateKategoriKamar(kategoriModal.id, kategoriForm);
                  setKategoriModal({ open: false, mode: 'add' });
                } finally { setIsSaving(false); }
              }} disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition shadow-md shadow-sky-500/20 disabled:opacity-50">
                {isSaving ? 'Menyimpan...' : kategoriModal.mode === 'add' ? 'Tambah' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kamar */}
      {kamarModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">{kamarModal.mode === 'add' ? 'Tambah Kamar' : 'Edit Kamar'}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Kategori Kamar</label>
                <select value={kamarForm.kategoriId} onChange={(e) => setKamarForm({ ...kamarForm, kategoriId: Number(e.target.value) })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 bg-white">
                  {availableKategori.map((k) => <option key={k.id} value={k.id}>{k.namaKategori}</option>)}
                </select></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Nomor Kamar *</label>
                <input type="text" value={kamarForm.nomorKamar} onChange={(e) => setKamarForm({ ...kamarForm, nomorKamar: e.target.value })} placeholder="101, 202, ..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" /></div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setKamarModal({ open: false, mode: 'add' })} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
              <button onClick={async () => {
                setIsSaving(true);
                try {
                  if (kamarModal.mode === 'add') await addKamar(kamarForm);
                  else if (kamarModal.id) await updateKamar(kamarModal.id, kamarForm);
                  setKamarModal({ open: false, mode: 'add' });
                } finally { setIsSaving(false); }
              }} disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition shadow-md shadow-sky-500/20 disabled:opacity-50">
                {isSaving ? 'Menyimpan...' : kamarModal.mode === 'add' ? 'Tambah' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirms */}
      {(kategoriDelete !== null || kamarDelete !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4 text-xl"><FaExclamationTriangle /></div>
            <h3 className="font-bold text-slate-800 text-lg">Hapus Data?</h3>
            <p className="text-slate-500 text-sm mt-2">Data ini akan dihapus permanen.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setKategoriDelete(null); setKamarDelete(null); }} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600">Batal</button>
              <button onClick={async () => {
                setIsSaving(true);
                try {
                  if (kategoriDelete !== null) { await deleteKategoriKamar(kategoriDelete); setKategoriDelete(null); }
                  if (kamarDelete !== null) { await deleteKamar(kamarDelete); setKamarDelete(null); }
                } finally { setIsSaving(false); }
              }} disabled={isSaving} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-semibold">
                {isSaving ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
