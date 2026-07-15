const Footer = () => {
  return (
    <footer className="bg-sky-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between">
        {/* Logo / Brand */}
        <div>
          <h2 className="text-2xl font-bold">WisTel</h2>
          <p className="mt-2 text-sm text-sky-300">
            Rekomendasi Hotel Terbaik di Tegal
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-6 md:mt-0 flex gap-6 text-sm">
          <a href="/" className="hover:text-sky-300 transition">
            Beranda
          </a>
          <a href="/accommodation" className="hover:text-sky-300 transition">
            Cari Hotel
          </a>
          <a href="/about" className="hover:text-sky-300 transition">
            Tentang
          </a>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-sky-900">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-sky-400">
          © {new Date().getFullYear()} WisTel. Collaboration Task.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
