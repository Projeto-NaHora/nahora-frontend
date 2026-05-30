// features/favorites/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { FavoritoStatusResponse } from "./types";

export const favoritesService = {
  /** GET /api/v1/profissionais/{profissionalId}/favoritado */
  getStatus: async (profissionalId: number): Promise<boolean> => {
    const { data } = await api.get<FavoritoStatusResponse>(
      ENDPOINTS.FAVORITO_STATUS(profissionalId),
    );
    return data.favoritado;
  },

  /** POST /api/v1/favoritos/{profissionalId} */
  favoritar: async (profissionalId: number): Promise<void> => {
    await api.post(ENDPOINTS.FAVORITAR(profissionalId));
  },

  /** DELETE /api/v1/favoritos/{profissionalId} */
  desfavoritar: async (profissionalId: number): Promise<void> => {
    await api.delete(ENDPOINTS.DESFAVORITAR(profissionalId));
  },
};
