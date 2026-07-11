import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Accommodation from "./pages/Accommodation";
import About from "./pages/About";

import "./index.css";
import MainLayout from "./layout/MainLayout";
import LoginForm from "./pages/LoginForm";
import AuthLayout from "./layout/AuthLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/accommodation" element={<Accommodation />} />
            <Route path="/about" element={<About />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
