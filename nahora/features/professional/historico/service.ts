// features/professional/historico/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { GanhosMensaisResponse, ServicoMesResponse, Page } from "./types";

export const historicoService = {
  buscarGanhos: async (
    mes: number,
    ano: number,
  ): Promise<GanhosMensaisResponse> => {
    const { data } = await api.get<GanhosMensaisResponse>(
      ENDPOINTS.HISTORICO_GANHOS(mes, ano),
    );
    return data;
  },

  /**
   * Backend returns Page<ServicoMesResponse> (Spring Page wrapper).
   * We extract the content array — pagination metadata is ignored for now.
   */
  buscarServicos: async (
    mes: number,
    ano: number,
  ): Promise<ServicoMesResponse[]> => {
    const { data } = await api.get<Page<ServicoMesResponse>>(
      ENDPOINTS.HISTORICO_SERVICOS(mes, ano),
    );
    if (data && Array.isArray(data.content)) return data.content;
    // Fallback: backend might return a plain array (legacy)
    if (Array.isArray(data)) return data;
    return [];
  },
};
