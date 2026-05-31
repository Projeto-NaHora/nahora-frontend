// features/favorites/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { FavoritoStatusResponse, PageResponse, FavoritoResponseDTO } from "./types";

export const favoritesService = {
  /** GET /api/v1/favoritos — lista favoritos do cliente (paginado, filtro opcional por categoriaId) */
  listar: async (
    categoriaId?: number,
    page: number = 0,
    size: number = 20,
  ): Promise<PageResponse<FavoritoResponseDTO>> => {
    const url = ENDPOINTS.FAVORITOS;
    const params = { categoriaId, page, size };
    console.debug("[DEBUG-fav] REQ →", "GET", url, "params:", JSON.stringify(params));
    const { data, status, headers } = await api.get<PageResponse<FavoritoResponseDTO>>(url, { params });
    console.debug("[DEBUG-fav] RES ← status:", status, "body:", JSON.stringify(data).slice(0, 500));
    console.debug("[DEBUG-fav] headers:", JSON.stringify(headers));
    return data;
  },

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
    await api.delete(ENDPOINTS.FAVORITAR(profissionalId));
  },
};
