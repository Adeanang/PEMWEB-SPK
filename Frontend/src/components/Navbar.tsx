import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../pages/AuthContext";
import { FaUserCircle, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

const menus = [
  { name: "Beranda", path: "/" },
  { name: "Cari Hotel", path: "/accommodation" },
  { name: "Tentang", path: "/about" },
  { name: "Perbandingan", path: "/perbandingan" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/", { replace: true });
  };

  const isAdmin = user?.role === "admin" || user?.role === "super admin";

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-sky-100">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-sky-600">
          WisTel
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {menus.map((menu) => (
            <Link
              key={menu.path}
              to={menu.path}
              className="text-slate-600 hover:text-sky-600 transition-colors font-medium text-sm"
            >
              {menu.name}
            </Link>
          ))}

          {/* ── Belum login ── */}
          {!user && (
            <Link
              to="/login"
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              Masuk
            </Link>
          )}

          {/* ── Sudah login ── */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-100 transition"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                  {user.email[0].toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-slate-700 leading-tight">
                    {user.email.split("@")[0]}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize leading-tight">
                    {user.role}
                  </p>
                </div>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-800 truncate">{user.email}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => { setDropdownOpen(false); navigate("/admin"); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                    >
                      <FaTachometerAlt size={13} className="text-sky-500" />
                      Dashboard Admin
                    </button>
                  )}
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("/"); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <FaUserCircle size={13} className="text-slate-400" />
                    Profil Saya
                  </button>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition"
                    >
                      <FaSignOutAlt size={13} />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
