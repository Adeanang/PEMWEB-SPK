import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-sky-600">WisTel</h1>
          <p className="mt-2 text-slate-500">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Masukkan email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-slate-300"
              />
              <span>Ingat saya</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sky-600 hover:underline"
            >
              Lupa Password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-sky-600 py-3 font-semibold text-white transition hover:bg-sky-700"
          >
            Masuk
          </button>
        </form>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-medium text-sky-600 hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;