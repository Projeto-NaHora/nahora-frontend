
// features/profile/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { ProfessionalProfileResponse } from "./types";

export const profileService = {
  /** Busca os dados do perfil do profissional logado */
  buscarPerfilProfissional: async (): Promise<ProfessionalProfileResponse> => {
    const { data } = await api.get<ProfessionalProfileResponse>(
      ENDPOINTS.PERFIL_PROFISSIONAL,
    );
    return data;
  },
};