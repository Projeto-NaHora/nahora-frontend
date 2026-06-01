import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { AvaliacaoRequest, AvaliacaoResponse } from "./types";

export const avaliacaoService = {
  /**
   * Cria uma avaliação para um pedido concluído.
   * POST /pedidos/{pedidoId}/avaliacao
   */
  criar: async (
    pedidoId: number,
    payload: AvaliacaoRequest,
  ): Promise<AvaliacaoResponse> => {
    const { data } = await api.post<AvaliacaoResponse>(
      ENDPOINTS.AVALIAR(pedidoId),
      payload,
    );
    return data;
  },

  /**
   * Busca a avaliação do usuário logado para um pedido.
   * Retorna null se o usuário ainda não avaliou (404 → null).
   * GET /pedidos/{pedidoId}/avaliacao
   */
  buscarPorPedido: async (
    pedidoId: number,
  ): Promise<AvaliacaoResponse | null> => {
    try {
      const { data } = await api.get<AvaliacaoResponse>(
        ENDPOINTS.AVALIAR_DO_PEDIDO(pedidoId),
      );
      return data;
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  },
};
