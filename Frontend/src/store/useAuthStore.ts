import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState{
    isAuthenticated: boolean;
    user: string | null;
    login: (userName: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist (
        (set) => ({
            isAuthenticated: false,
            user: null,
            login: (userName) => 
                set ({ isAuthenticated: true , user: userName }),
            logout: () => set({ isAuthenticated: false, user: null}),
        }),
        {
            name: "auth-storage",
        },
    ),
);