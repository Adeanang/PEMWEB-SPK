import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaHotel, FaExclamationCircle } from "react-icons/fa";
import { useAuth } from "./AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {
      // Arahkan sesuai role
      const role = (result.role ?? "").toUpperCase();
      if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "SUPER ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else {
      setError(result.message ?? "Email atau password salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-600 via-cyan-500 to-sky-400 px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4 text-2xl shadow-md shadow-sky-100">
              <FaHotel />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Selamat Datang</h1>
            <p className="text-slate-400 text-sm mt-1">
              Masuk ke akun WisTel untuk melanjutkan
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl mb-5">
              <FaExclamationCircle className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@gmail.com"
                required
                autoComplete="email"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-700 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 accent-sky-500"
                />
                <span>Ingat saya</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sky-600 hover:text-sky-700 font-medium text-xs"
              >
                Lupa Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-semibold py-3 rounded-xl shadow-lg shadow-sky-500/25 transition duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Memverifikasi...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {/* Hint akun */}
          <div className="mt-6 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Akun Demo
            </p>
            <div className="space-y-1">
              {[
                { role: "Super Admin", email: "adeanang@gmail.com", pwd: "anang1234" },
                { role: "Admin", email: "kurniawan@gmail.com", pwd: "kurni1234" },
                { role: "User", email: "wawanpride@gmail.com", pwd: "wawan1234" },
              ].map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => { setEmail(a.email); setPassword(a.pwd); setError(""); }}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sky-50 transition group"
                >
                  <span className="text-xs text-slate-600 group-hover:text-sky-700 font-medium">{a.email}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    a.role === "Super Admin" ? "bg-violet-100 text-violet-700" :
                    a.role === "Admin" ? "bg-sky-100 text-sky-700" :
                    "bg-slate-200 text-slate-600"
                  }`}>
                    {a.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back to home */}
        <p className="text-center mt-5 text-white/80 text-sm">
          Belum punya akun?{" "}
          <Link to="/" className="font-semibold text-white hover:underline">
            Kembali ke Beranda
          </Link>
        </p>
      </div>
    </div>
  );
}