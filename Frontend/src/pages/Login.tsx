import { useState } from "react";
import { useAuth } from "./AuthContext"; // Sesuaikan path-nya

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Data User dummy diambil langsung dari rancangan DB Anda
  const mockUsersFromDB = [
    { id: 1, email: "anang@gmail.com", password: "anang1234", role: "super admin" },
    { id: 2, email: "kurniawan@gmail.com", password: "kurni1234", role: "admin" },
    { id: 3, email: "wawanpride@gmail.com", password: "wawan1234", role: "user" },
    { id: 4, email: "gunawan1234@gmail.com", password: "gunawan123", role: "admin" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const result = login(email, password, mockUsersFromDB);
    if (result.success) {
      // Redirect sesuai role atau ke beranda
      alert(`Login berhasil sebagai ${result.role}!`);
      window.location.href = "/";
    } else {
      setError(result.message ?? "Email atau password salah!");
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-sky-100">
        <h2 className="text-3xl font-bold text-center text-slate-800">WisTour</h2>
        <p className="text-center text-slate-400 text-sm mt-2">
          Masuk untuk mulai memesan penginapan terbaik
        </p>

        {error && (
          <div className="mt-4 bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 ml-1 block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="contoh@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-sky-500 text-slate-700"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 ml-1 block mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-sky-500 text-slate-700"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-sky-500/25 transition duration-200"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}