// store/authStore.ts
import { create } from "zustand";
import { storage } from "@/utils/storage";

type TipoUsuario = "CLIENTE" | "PROFISSIONAL";

interface User {
  id: number;
  nome: string;
  tipo: TipoUsuario;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setTokens: (access: string, refresh: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,

  setTokens: async (access, refresh, user) => {
    await storage.set("refreshToken", refresh);
    set({ accessToken: access, user });
  },

  logout: async () => {
    await storage.delete("refreshToken");
    set({ accessToken: null, user: null });
  },
}));
