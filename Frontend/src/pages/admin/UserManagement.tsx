import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAdminStore } from '../../store/adminStore';
import type { User } from '../../types/spk';

type UserForm = Omit<User, 'id'>;

const ROLE_COLORS: Record<string, string> = {
  'super admin': 'bg-violet-100 text-violet-700',
  admin: 'bg-sky-100 text-sky-700',
  user: 'bg-slate-100 text-slate-600',
};

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useAdminStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; id?: number }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<UserForm>({ email: '', password: '', role: 'user' });
  const [showPwd, setShowPwd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filtered = users.filter((u) => {
    const matchSearch = search.trim() === '' || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === '' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleCounts = {
    'super admin': users.filter((u) => u.role === 'super admin').length,
    admin: users.filter((u) => u.role === 'admin').length,
    user: users.filter((u) => u.role === 'user').length,
  };

  const openAdd = () => { setForm({ email: '', password: '', role: 'user' }); setShowPwd(false); setModal({ open: true, mode: 'add' }); };
  const openEdit = (u: User) => {
    const { id, ...rest } = u;
    setForm(rest);
    setShowPwd(false);
    setModal({ open: true, mode: 'edit', id });
  };
  const handleSave = async () => {
    if (!form.email || !form.password) return;
    setIsSaving(true);
    try {
      if (modal.mode === 'add') await addUser(form);
      else if (modal.id) await updateUser(modal.id, form);
      setModal({ open: false, mode: 'add' });
    } finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen User</h2>
          <p className="text-slate-500 text-sm">{users.length} akun terdaftar</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-sky-500/20"
        >
          <FaPlus size={11} /> Tambah User
        </button>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {(Object.entries(roleCounts) as [string, number][]).map(([role, count]) => (
          <button
            key={role}
            onClick={() => setRoleFilter(roleFilter === role ? '' : role)}
            className={`bg-white rounded-2xl border p-4 text-left transition hover:shadow-md ${roleFilter === role ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-100'}`}
          >
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ROLE_COLORS[role]}`}>{role}</span>
            <p className="text-3xl font-bold text-slate-800 mt-2">{count}</p>
            <p className="text-xs text-slate-400">akun</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">ID</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Email</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Role</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Password</th>
              <th className="text-right px-5 py-3.5 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">#{u.id}</td>
                <td className="px-5 py-3.5 font-medium text-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {u.email[0].toUpperCase()}
                    </div>
                    {u.email}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ROLE_COLORS[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{'•'.repeat(u.password?.length || 8)}</td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(u)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition"><FaEdit size={13} /></button>
                    <button onClick={() => setDeleteTarget(u.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"><FaTrash size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-slate-400">Tidak ada user ditemukan</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">{modal.mode === 'add' ? 'Tambah User Baru' : 'Edit User'}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password *</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Masukkan password" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
                  <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['super admin', 'admin', 'user'] as const).map((r) => ( 
                    <button
                      key={r}
                      onClick={() => setForm({ ...form, role: r })}
                      className={`py-2.5 rounded-xl text-xs font-bold transition border ${
                        form.role === r ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModal({ open: false, mode: 'add' })} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-sm font-semibold transition shadow-md shadow-sky-500/20">{isSaving ? 'Menyimpan...' : modal.mode === 'add' ? 'Tambah' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4 text-xl"><FaExclamationTriangle /></div>
            <h3 className="font-bold text-slate-800 text-lg">Hapus User?</h3>
            <p className="text-slate-500 text-sm mt-2">Akun <span className="font-semibold text-slate-700">{users.find((u) => u.id === deleteTarget)?.email}</span> akan dihapus permanen.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600">Batal</button>
              <button onClick={async () => {
                setIsSaving(true);
                try {
                  if (deleteTarget !== null) await deleteUser(deleteTarget);
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
