import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import { useAdminStore } from '../store/adminStore';
import {
  FaHome,
  FaHotel,
  FaLayerGroup,
  FaKey,
  FaConciergeBell,
  FaBalanceScale,
  FaListUl,
  FaTable,
  FaUsers,
  FaHistory,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaBed,
  FaThLarge,
  FaChartBar,
} from 'react-icons/fa';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  children: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Data Master',
    icon: <FaThLarge />,
    children: [
      { label: 'Hotel', path: '/admin/hotel', icon: <FaHotel /> },
      { label: 'Kategori Hotel', path: '/admin/kategori-hotel', icon: <FaLayerGroup /> },
      { label: 'Kategori Kamar', path: '/admin/kategori-kamar', icon: <FaBed /> },
      { label: 'Kamar', path: '/admin/kamar', icon: <FaKey /> },
      { label: 'Fasilitas Hotel', path: '/admin/fasilitas', icon: <FaConciergeBell /> },
    ],
  },
  {
    label: 'SPK',
    icon: <FaBalanceScale />,
    children: [
      { label: 'Kriteria & Bobot', path: '/admin/kriteria', icon: <FaBalanceScale /> },
      { label: 'Sub Kriteria', path: '/admin/sub-kriteria', icon: <FaListUl /> },
      { label: 'Nilai Hotel', path: '/admin/hotel-kriteria', icon: <FaTable /> },
      // { label: 'Perbandingan AHP', path: '/admin/perbandingan', icon: <FaChartBar /> },
    ],
  },
  {
    label: 'Pengguna',
    icon: <FaUsers />,
    children: [
      { label: 'Manajemen User', path: '/admin/users', icon: <FaUsers /> },
    ],
  },
  {
    label: 'Rekomendasi',
    icon: <FaHistory />,
    children: [
      { label: 'History Rekomendasi', path: '/admin/rekomendasi', icon: <FaHistory /> },
    ],
  },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<string[]>([
    'Data Master',
    'SPK',
    'Pengguna',
    'Rekomendasi',
  ]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { fetchAdminData } = useAdminStore();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } flex-shrink-0 transition-all duration-300 ease-in-out bg-gradient-to-b from-sky-700 via-sky-600 to-cyan-600 flex flex-col shadow-2xl z-30`}
      >
        {/* Logo / Toggle */}
        <div className="h-16 flex items-center px-4 gap-3 border-b border-white/10 shrink-0">
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-lg leading-tight truncate">WisTel</p>
              <p className="text-white/60 text-[10px] font-medium tracking-widest uppercase">
                Admin Panel
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition shrink-0"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {/* Overview link */}
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/25 text-white shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <FaHome size={14} className="shrink-0" />
            {sidebarOpen && <span>Overview</span>}
          </NavLink>

          {/* Nav Groups */}
          {navGroups.map((group) => (
            <div key={group.label} className="mt-1">
              {/* Group header label */}
              {sidebarOpen ? (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white/40 hover:text-white/60 transition uppercase tracking-widest"
                >
                  <span className="flex-1 text-left">{group.label}</span>
                  {openGroups.includes(group.label) ? (
                    <FaChevronDown size={8} />
                  ) : (
                    <FaChevronRight size={8} />
                  )}
                </button>
              ) : (
                <div className="px-3 py-1.5 flex justify-center text-white/30">
                  <span className="text-xs">{group.icon}</span>
                </div>
              )}

              {/* Group items */}
              {(sidebarOpen ? openGroups.includes(group.label) : true) && (
                <div className={sidebarOpen ? 'ml-1 space-y-0.5 mt-0.5' : 'space-y-0.5'}>
                  {group.children.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                          isActive
                            ? 'bg-white/25 text-white font-semibold shadow-sm'
                            : 'text-white/65 hover:text-white hover:bg-white/10'
                        }`
                      }
                    >
                      <span className="shrink-0 text-xs">{item.icon}</span>
                      {sidebarOpen && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="p-3 border-t border-white/10 shrink-0">
          {sidebarOpen && user && (
            <div className="flex items-center gap-3 px-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user.email[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">
                  {user.email.split('@')[0]}
                </p>
                <p className="text-white/50 text-[10px] truncate capitalize">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/10 transition"
          >
            <FaSignOutAlt size={13} className="shrink-0" />
            {sidebarOpen && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4 shadow-sm shrink-0 z-20">
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-slate-800">Dashboard Admin</h1>
            <p className="text-xs text-slate-400">WisTel — Sistem Rekomendasi Hotel Tegal</p>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-700">{user.email}</p>
                <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
              </div>
            )}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-sky-500/30 shrink-0">
              {user ? user.email[0].toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}