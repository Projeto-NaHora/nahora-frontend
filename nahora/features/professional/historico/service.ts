// features/professional/historico/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { GanhosMensaisResponse, ServicoHistoricoResponse } from "./types";

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

  buscarServicos: async (
    mes: number,
    ano: number,
  ): Promise<ServicoHistoricoResponse[]> => {
    const { data } = await api.get(ENDPOINTS.HISTORICO_SERVICOS(mes, ano));
    // Se o backend retornar um wrapper (ex.: { content: [...] }), extrai o array
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  },
};
