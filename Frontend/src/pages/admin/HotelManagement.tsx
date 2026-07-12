import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaStar, FaSearch, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useAdminStore } from '../../store/adminStore';
import type { Hotel } from '../../types/spk';

type NilaiKey = 'harga' | 'jarak' | 'rating' | 'fasilitas' | 'kebersihan' | 'pelayanan';

const NILAI_LABELS: Record<NilaiKey, string> = {
  harga: 'Harga (Rp)', jarak: 'Jarak (km)', rating: 'Rating (1-5)',
  fasilitas: 'Fasilitas (jml)', kebersihan: 'Kebersihan (1-5)', pelayanan: 'Pelayanan (1-5)',
};

type HotelForm = Omit<Hotel, 'id' | 'fasilitas_list'> & { fasilitas_raw: string };

const emptyForm: HotelForm = {
  name: '', location: '', sosial_media: '', image_hotel: '',
  id_user: 1, id_kategori_hotel: 1,
  nilai: { harga: 300000, jarak: 2, rating: 4, fasilitas: 3, kebersihan: 4, pelayanan: 4 },
  fasilitas_raw: '',
};

export default function HotelManagement() {
  const { hotels, users, kategoriHotels, addHotel, updateHotel, deleteHotel } = useAdminStore();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; id?: number }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<HotelForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const filtered = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.location.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ open: true, mode: 'add' });
  };

  const openEdit = (hotel: Hotel) => {
    setForm({
      name: hotel.name, location: hotel.location,
      sosial_media: hotel.sosial_media ?? '',
      image_hotel: hotel.image_hotel ?? '',
      id_user: hotel.id_user,
      id_kategori_hotel: hotel.id_kategori_hotel,
      nilai: { ...hotel.nilai },
      fasilitas_raw: hotel.fasilitas_list.join(', '),
    });
    setModal({ open: true, mode: 'edit', id: hotel.id });
  };

  const handleSave = () => {
    const { fasilitas_raw, ...rest } = form;
    const fasilitas_list = fasilitas_raw.split(',').map((f) => f.trim()).filter(Boolean);
    if (modal.mode === 'add') {
      addHotel({ ...rest, fasilitas_list });
    } else if (modal.id) {
      updateHotel(modal.id, { ...rest, fasilitas_list });
    }
    setModal({ open: false, mode: 'add' });
  };

  const setNilai = (key: NilaiKey, val: number) =>
    setForm((f) => ({ ...f, nilai: { ...f.nilai, [key]: val } }));

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Hotel</h2>
          <p className="text-slate-500 text-sm">{hotels.length} hotel terdaftar</p>
        </div>
        <button
          id="btn-tambah-hotel"
          onClick={openAdd}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-sky-500/20"
        >
          <FaPlus size={11} /> Tambah Hotel
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
        <input
          id="search-hotel"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama hotel atau lokasi..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Hotel</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Lokasi</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Kategori</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Harga/malam</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Rating</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Fasilitas</th>
                <th className="text-right px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((hotel) => {
                const kategori = kategoriHotels.find((k) => k.id === hotel.id_kategori_hotel);
                return (
                  <tr key={hotel.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {hotel.image_hotel ? (
                          <img src={hotel.image_hotel} alt={hotel.name} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                            <span className="text-sky-500 text-xs font-bold">{hotel.name[0]}</span>
                          </div>
                        )}
                        <span className="font-semibold text-slate-800 whitespace-nowrap">{hotel.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt size={11} className="text-slate-400" />
                        {hotel.location}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold whitespace-nowrap">
                        {kategori?.nama_kategori ?? '-'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium whitespace-nowrap">
                      Rp {hotel.nilai.harga.toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-amber-500">
                        <FaStar size={11} />
                        <span className="text-slate-700 font-semibold">{hotel.nilai.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {hotel.fasilitas_list.slice(0, 2).map((f) => (
                          <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium whitespace-nowrap">
                            {f}
                          </span>
                        ))}
                        {hotel.fasilitas_list.length > 2 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 font-medium whitespace-nowrap">
                            +{hotel.fasilitas_list.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(hotel)}
                          className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition"
                          title="Edit"
                        >
                          <FaEdit size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(hotel.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-slate-400 text-sm">
                    Tidak ada hotel ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Add/Edit ─────────────────────────────────────────────────── */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-xl text-slate-800">
                {modal.mode === 'add' ? 'Tambah Hotel Baru' : 'Edit Hotel'}
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">Lengkapi data hotel dan nilai kriteria SAW</p>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Row 1 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Hotel *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Plaza Hotel"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Lokasi *</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Contoh: Kota Tegal"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
              {/* Row 2 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sosial Media</label>
                  <input
                    type="text"
                    value={form.sosial_media}
                    onChange={(e) => setForm({ ...form, sosial_media: e.target.value })}
                    placeholder="@username"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kategori Hotel</label>
                  <select
                    value={form.id_kategori_hotel}
                    onChange={(e) => setForm({ ...form, id_kategori_hotel: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-white"
                  >
                    {kategoriHotels.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* URL Gambar */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">URL Gambar Hotel</label>
                <input
                  type="text"
                  value={form.image_hotel}
                  onChange={(e) => setForm({ ...form, image_hotel: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              {/* Manager */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pengelola (User)</label>
                <select
                  value={form.id_user}
                  onChange={(e) => setForm({ ...form, id_user: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-white"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.email} ({u.role})</option>
                  ))}
                </select>
              </div>
              {/* Nilai Kriteria */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-[10px]">S</span>
                  Nilai Kriteria SAW
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(Object.keys(NILAI_LABELS) as NilaiKey[]).map((key) => (
                    <div key={key}>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">{NILAI_LABELS[key]}</label>
                      <input
                        type="number"
                        value={form.nilai[key]}
                        onChange={(e) => setNilai(key, Number(e.target.value))}
                        step={key === 'harga' ? 10000 : key === 'jarak' ? 0.1 : 0.1}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Fasilitas */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Fasilitas <span className="text-slate-400 font-normal">(pisahkan dengan koma)</span>
                </label>
                <input
                  type="text"
                  value={form.fasilitas_raw}
                  onChange={(e) => setForm({ ...form, fasilitas_raw: e.target.value })}
                  placeholder="Wifi Gratis, Kolam Renang, Breakfast"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setModal({ open: false, mode: 'add' })}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition shadow-md shadow-sky-500/20"
              >
                {modal.mode === 'add' ? 'Tambah Hotel' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ─────────────────────────────────────────────────── */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4 text-xl">
              <FaExclamationTriangle />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Hapus Hotel?</h3>
            <p className="text-slate-500 text-sm mt-2">
              Data hotel{' '}
              <span className="font-semibold text-slate-700">
                {hotels.find((h) => h.id === deleteTarget)?.name}
              </span>{' '}
              akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                onClick={() => { deleteHotel(deleteTarget); setDeleteTarget(null); }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
