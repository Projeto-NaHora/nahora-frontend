import { create } from "zustand";
import { storage } from "@/utils/storage";
import { decodeJwtPayload } from "@/utils/jwt";
import { disconnectStomp, chatWsManager } from "@/features/chat/stompClient";
import { useNotifStore } from "@/store/notifStore";

import type { TipoUsuarioApp } from "@/types/enums";

interface User {
  id: number;
  nome: string;
  tipo: TipoUsuarioApp;
}

// Tracks which phase of professional onboarding is pending.
// null = onboarding complete (or not a professional).
export type ProfessionalOnboarding =
  | "identidade"
  | "aguardando"
  | "perfil"
  | "cadastro_incompleto"
  | "rejeitado";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  professionalOnboarding: ProfessionalOnboarding | null;
  setTokens: (
    access: string,
    refresh: string,
    tipoUsuario?: string,
  ) => Promise<void>;
  setProfessionalOnboarding: (
    phase: ProfessionalOnboarding | null,
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

  console.log(
    "[AuthStore] JWT payload keys:",
    Object.keys(payload),
    "tipoUsuario arg:",
    tipoUsuario,
    "jwt:",
    accessToken,
  );

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
  const tipo =
    tipoUsuario ??
    (payload.tipoUsuario as string) ??
    (payload.tipo as string) ??
    "";

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
  professionalOnboarding: null,

  setTokens: async (access, refresh, tipoUsuario) => {
    const user = extractUserFromToken(access, tipoUsuario);
    set({ accessToken: access, user });
    chatWsManager.setToken(access);
    await storage.set("refreshToken", refresh);
  },

  setProfessionalOnboarding: async (phase) => {
    // Update store immediately (sync) so guard reacts before SecureStore finishes.
    set({ professionalOnboarding: phase });
    if (phase === null) {
      await storage.delete("professionalOnboarding");
    } else {
      await storage.set("professionalOnboarding", phase);
    }
  },

  restoreSession: async () => {
    try {
      const refreshToken = await storage.get("refreshToken");
      if (!refreshToken) return false;

      const savedOnboarding = await storage.get("professionalOnboarding");

      const { default: axios } = await import("axios");
      const { API_URL } = await import("@/services/api/endpoints");
      const { data } = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });

      await storage.set("refreshToken", data.refreshToken);
      const user = extractUserFromToken(data.accessToken, data.tipoUsuario);
      set({
        accessToken: data.accessToken,
        user,
        professionalOnboarding:
          (savedOnboarding as ProfessionalOnboarding | null) ?? null,
      });
      chatWsManager.setToken(data.accessToken);
      return true;
    } catch {
      await storage.delete("refreshToken");
      return false;
    }
  },

  logout: async () => {
    await storage.delete("refreshToken");
    await storage.delete("professionalOnboarding");
    chatWsManager.setToken(null);
    disconnectStomp();
    useNotifStore.getState().clear();
    set({ accessToken: null, user: null, professionalOnboarding: null });
  },
}));
