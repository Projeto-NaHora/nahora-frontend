// features/settings/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type {
  UserPreferences,
  UpdatePreferencesPayload,
  ChangePasswordPayload,
} from "./types";

export const settingsService = {
  buscarPreferencias: async (): Promise<UserPreferences> => {
    const { data } = await api.get<UserPreferences>(ENDPOINTS.PREFERENCIAS);
    return data;
  },

  atualizarPreferencias: async (
    payload: UpdatePreferencesPayload,
  ): Promise<UserPreferences> => {
    const { data } = await api.patch<UserPreferences>(
      ENDPOINTS.PREFERENCIAS,
      payload,
    );
    return data;
  },

  alterarSenha: async (
    payload: ChangePasswordPayload,
  ): Promise<{ message: string }> => {
    const { data } = await api.put<{ message: string }>(
      ENDPOINTS.ALTERAR_SENHA,
      payload,
    );
    return data;
  },
};
