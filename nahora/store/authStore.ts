import { create } from "zustand";
import { storage } from "@/utils/storage";
import { decodeJwtPayload } from "@/utils/jwt";
import { disconnectStomp } from "@/features/chat/stompClient";
import { useNotifStore } from "@/store/notifStore";

import type { TipoUsuarioApp } from "@/types/enums";

interface User {
  id: number;
  nome: string;
  tipo: TipoUsuarioApp;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setTokens: (
    access: string,
    refresh: string,
    tipoUsuario?: string,
  ) => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => void;
}

/**
 * Extracts user info (id, nome, tipo) from the JWT access token payload.
 *
 * O backend (JwtService) grava os seguintes claims no JWT:
 *   - sub → email do usuário
 *   - id  → ID numérico do usuário
 *   - nome → nome completo
 *   - tipoUsuario → "CLIENTE" | "PROFISSIONAL"
 *
 * O parâmetro `tipoUsuario` vindo do corpo da resposta HTTP é opcional;
 * quando ausente (ex.: refresh silencioso), usa-se o claim `tipoUsuario` do JWT.
 */
function extractUserFromToken(
  accessToken: string,
  tipoUsuario?: string,
): User | null {
  const payload = decodeJwtPayload<Record<string, unknown>>(accessToken);
  if (!payload) {
    console.warn("[AuthStore] Falha ao decodificar payload do JWT");
    return null;
  }

  // ID: prefere `id` (numérico) sobre `sub` que é o email
  const id = Number(
    payload.id ?? payload.sub ?? payload.userId ?? payload.user_id,
  );

  // Nome: o backend usa `nome`
  const nome =
    (payload.nome as string) ??
    (payload.name as string) ??
    (payload.fullName as string) ??
    "";

  // Tipo: prioriza o argumento da API, mas usa o claim do JWT como fallback
  const tipo = tipoUsuario ?? (payload.tipoUsuario as string) ?? "";

  if (!id || !nome || !tipo) {
    console.warn(
      "[AuthStore] Claims ausentes no JWT:",
      JSON.stringify({ id, nome, tipo, keys: Object.keys(payload ?? {}) }),
    );
    return null;
  }

  return { id, nome, tipo: tipo as TipoUsuarioApp };
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,

  setTokens: async (access, refresh, tipoUsuario) => {
    await storage.set("refreshToken", refresh);
    const user = extractUserFromToken(access, tipoUsuario);
    set({ accessToken: access, user });
  },

  restoreSession: async () => {
    try {
      const refreshToken = await storage.get("refreshToken");
      if (!refreshToken) return false;

      const { default: axios } = await import("axios");
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
        { refreshToken },
      );

      await storage.set("refreshToken", data.refreshToken);
      const user = extractUserFromToken(data.accessToken, data.tipoUsuario);
      set({ accessToken: data.accessToken, user });
      return true;
    } catch {
      await storage.delete("refreshToken");
      return false;
    }
  },

  logout: async () => {
    await storage.delete("refreshToken");
    disconnectStomp();
    useNotifStore.getState().clear();
    set({ accessToken: null, user: null });
  },
}));
