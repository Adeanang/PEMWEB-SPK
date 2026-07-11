import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// 1. Definisikan tipe data untuk User sesuai struktur DB kamu
export interface User {
  id: number;
  email: string;
  role: string;
}

// 2. Definisikan tipe data untuk nilai yang disediakan oleh AuthContext
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, mockUsers: any[]) => { success: boolean; role?: string; message?: string };
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

  // Memperbaiki error implicit 'any' pada parameter fungsi login
  const login = (email: string, password: string, mockUsers: any[]) => {
    // Memperbaiki error implicit 'any' pada parameter 'u' di method find
    const foundUser = mockUsers.find(
      (u: any) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
      };
      setUser(userData);
      localStorage.setItem("wistour_user", JSON.stringify(userData));
      return { success: true, role: foundUser.role };
    }
    return { success: false, message: "Email atau password salah!" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("wistour_user");
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