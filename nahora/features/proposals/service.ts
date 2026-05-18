import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { Proposta, PropostaResponseRaw, CriarPropostaPayload } from "./types";

export function mapRawToProposta(raw: PropostaResponseRaw): Proposta {
  return {
    id: raw.id,
    pedidoId: raw.pedidoId ?? 0,
    profissional: {
      id: raw.profissionalId ?? 0,
      nome: raw.profissionalNome,
      foto: raw.profissionalFotoUrl,
      notaMedia: raw.notaMedia,
      totalAvaliacoes: raw.numeroAvaliacoes,
      totalServicosExecutados: raw.totalServicosExecutados ?? 0,
      distancia: raw.distancia,
      localidade: raw.localidade,
      especialidades: raw.especialidades,
      disponivel: true,
    },
    valor: raw.valor ?? raw.valorOferecido ?? 0,
    descricao: raw.descricao,
    tempoEstimado: raw.tempoEstimado,
    status: raw.status,
    expiraEm: raw.expiraEm,
    criadoEm: raw.criadoEm,
    atualizadoEm: raw.atualizadoEm,
  };
}

export const proposalsService = {
  listarPorPedido: async (pedidoId: number): Promise<Proposta[]> => {
    const { data } = await api.get<PropostaResponseRaw[]>(ENDPOINTS.PROPOSTAS(pedidoId));
    return data.map(mapRawToProposta);
  },

  buscarPorId: async (id: number): Promise<Proposta> => {
    const { data } = await api.get<PropostaResponseRaw>(ENDPOINTS.PROPOSTA(id));
    return mapRawToProposta(data);
  },

  criar: async (pedidoId: number, payload: CriarPropostaPayload): Promise<Proposta> => {
    const { data } = await api.post<PropostaResponseRaw>(ENDPOINTS.CRIAR_PROPOSTA(pedidoId), payload);
    return mapRawToProposta(data);
  },

  aceitar: async (id: number): Promise<void> => {
    await api.post(ENDPOINTS.ACEITAR_PROPOSTA(id));
  },

  recusar: async (id: number): Promise<void> => {
    await api.post(ENDPOINTS.RECUSAR_PROPOSTA(id));
  },
};