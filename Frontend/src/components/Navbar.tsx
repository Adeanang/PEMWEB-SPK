import { Link } from "react-router-dom";

const menus = [
  {
    name: "Beranda",
    path: "/",
  },
  {
    name: "Cari Hotel",
    path: "/accommodation",
  },
  {
    name: "Tentang",
    path: "/about",
  },
];

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-sky-100">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-sky-600"
        >
          WisTel
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {menus.map((menu) => (
            <Link
              key={menu.path}
              to={menu.path}
              className="text-slate-600 hover:text-sky-600 transition-colors font-medium"
            >
              {menu.name}
            </Link>
          ))}
          <Link
            to="/login"
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition-colors"
          >
            Masuk
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
