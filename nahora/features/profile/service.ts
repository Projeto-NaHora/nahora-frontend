// features/profile/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type {
  FavoriteProfessional,
  ProfessionalProfileResponse,
} from "./types";

export const profileService = {
  /** Busca os dados do perfil do profissional logado */
  buscarPerfilProfissional: async (): Promise<ProfessionalProfileResponse> => {
    const { data } = await api.get<ProfessionalProfileResponse>(
      ENDPOINTS.PERFIL_PROFISSIONAL,
    );
    return data;
  },

  /** Busca a lista de profissionais favoritos do cliente logado */
  buscarFavoritos: async (): Promise<FavoriteProfessional[]> => {
    const { data } = await api.get<FavoriteProfessional[]>(ENDPOINTS.FAVORITOS);
    return data;
  },

  /** Adiciona um profissional aos favoritos */
  favoritar: async (id: number): Promise<void> => {
    await api.post(ENDPOINTS.FAVORITAR(id));
  },

  /** Remove um profissional dos favoritos */
  desfavoritar: async (id: number): Promise<void> => {
    await api.delete(ENDPOINTS.FAVORITAR(id));
  },
};
