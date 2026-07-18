import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "../utils/api";

// 1. Definisikan tipe data untuk User sesuai struktur DB kamu
export interface User {
  id: number;
  email: string;
  role: string;
}

// 2. Definisikan tipe data untuk nilai yang disediakan oleh AuthContext
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: string; message?: string }>;
  logout: () => void;
  loading: boolean;
}

// 3. Inisialisasi Context dengan nilai default undefined (bukan null agar tidak bentrok)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode; // Memperbaiki error "children implicitly has an 'any' type"
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null); // Memperbaiki error SetStateAction<null>
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("wistour_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      
      const userData: User = {
        id: response.data.user.id,
        email: response.data.user.email,
        role: response.data.user.role,
      };
      
      setUser(userData);
      localStorage.setItem("wistour_user", JSON.stringify(userData));
      localStorage.setItem("token", response.data.token);
      return { success: true, role: userData.role };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Email atau password salah!" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("wistour_user");
    localStorage.removeItem("token");
  };

  return (
    // Memperbaiki error assignable to type 'null' pada property value
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};