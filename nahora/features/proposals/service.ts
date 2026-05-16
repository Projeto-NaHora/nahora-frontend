import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { Proposta } from "./types";

export const proposalsService = {
  listarPorPedido: async (pedidoId: number): Promise<Proposta[]> => {
    const { data } = await api.get<Proposta[]>(ENDPOINTS.PROPOSTAS(pedidoId));
    return data;
  },

  buscarPorId: async (id: number): Promise<Proposta> => {
    const { data } = await api.get<Proposta>(ENDPOINTS.PROPOSTA(id));
    return data;
  },

  aceitar: async (id: number): Promise<void> => {
    await api.post(ENDPOINTS.ACEITAR_PROPOSTA(id));
  },

  recusar: async (id: number): Promise<void> => {
    await api.post(ENDPOINTS.RECUSAR_PROPOSTA(id));
  },
};