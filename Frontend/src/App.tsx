import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./pages/AuthContext";
import type { ReactNode } from "react";

import Home from "./pages/Home";
import Accommodation from "./pages/Accommodation";
import About from "./pages/About";

import "./index.css";
import MainLayout from "./layout/MainLayout";
import LoginForm from "./pages/LoginForm";
import AuthLayout from "./layout/AuthLayout";
import DashboardLayout from "./layout/DashboardLayout";

// Admin pages
import Overview from "./pages/admin/Overview";
import HotelManagement from "./pages/admin/HotelManagement";
import KategoriHotelManagement from "./pages/admin/KategoriHotelManagement";
import KriteriaManagement from "./pages/admin/KriteriaManagement";
import SubKriteriaManagement from "./pages/admin/SubKriteriaManagement";
import HotelKriteriaManagement from "./pages/admin/HotelKriteriaManagement";
import PerbandinganAHP from "./pages/admin/PerbandinganAHP";
import KamarManagement from "./pages/admin/KamarManagement";
import FasilitasManagement from "./pages/admin/FasilitasManagement";
import UserManagement from "./pages/admin/UserManagement";
import RekomendasiHistory from "./pages/admin/RekomendasiHistory";

// ── Guard: hanya admin / super admin yang boleh masuk /admin ────────────────
function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-sky-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="text-slate-500 text-sm font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "admin" && user.role !== "super admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// ── Guard: kalau sudah login, jangan bisa buka /login lagi ─────────────────
function RedirectIfLoggedIn({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    return user.role === "admin" || user.role === "super admin"
      ? <Navigate to="/admin" replace />
      : <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

// ── Semua routes ────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User-facing */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/about" element={<About />} />
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                <RedirectIfLoggedIn>
                  <LoginForm />
                </RedirectIfLoggedIn>
              }
            />
          </Route>
        </Route>

        {/* Admin (protected) */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <DashboardLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Overview />} />
          <Route path="hotel" element={<HotelManagement />} />
          <Route path="kategori-hotel" element={<KategoriHotelManagement />} />
          <Route path="kategori-kamar" element={<KamarManagement />} />
          <Route path="kamar" element={<KamarManagement />} />
          <Route path="fasilitas" element={<FasilitasManagement />} />
          <Route path="kriteria" element={<KriteriaManagement />} />
          <Route path="sub-kriteria" element={<SubKriteriaManagement />} />
          <Route path="hotel-kriteria" element={<HotelKriteriaManagement />} />
          <Route path="perbandingan" element={<PerbandinganAHP />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="rekomendasi" element={<RekomendasiHistory />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// ── Root: AuthProvider membungkus semua routes ──────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
