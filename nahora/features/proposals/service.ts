import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { Proposta, PropostaResponseRaw, CriarPropostaPayload, AceitarPropostaResponseDTO } from "./types";

export function mapRawToProposta(raw: PropostaResponseRaw): Proposta {
  return {
    id: raw.id,
    pedidoId: raw.pedidoId ?? 0,
    profissional: {
      id: raw.profissionalId ?? 0,
      nome: raw.profissionalNome ?? "",
      foto: raw.profissionalFotoUrl,
      notaMedia: raw.notaMedia ?? 0,
      totalAvaliacoes: raw.numeroAvaliacoes ?? 0,
      totalServicosExecutados: raw.totalServicosExecutados ?? raw.numeroServicosRealizados ?? 0,
      distancia: raw.distancia ?? raw.distanciaKm,
      localidade: raw.localidade,
      especialidades: raw.especialidades,
      disponivel: true,
    },
    valor: raw.valorProposto ?? raw.valor ?? raw.valorOferecido ?? 0,
    descricao: raw.mensagem ?? raw.descricao,
    tempoEstimado: raw.tempoEstimado,
    status: raw.status,
    expiraEm: raw.expiraEm,
    horariosDisponiveis: raw.horariosDisponiveis,
    criadoEm: raw.criadoEm,
    atualizadoEm: raw.atualizadoEm,
  };
}

export const proposalsService = {
  listarPorPedido: async (pedidoId: number): Promise<Proposta[]> => {
    const { data } = await api.get<PropostaResponseRaw[]>(ENDPOINTS.PROPOSTAS(pedidoId));
    return data.map(mapRawToProposta);
  },

  buscarPorId: async (pedidoId: number, propostaId: number): Promise<Proposta> => {
    const { data } = await api.get<PropostaResponseRaw>(ENDPOINTS.PROPOSTA(pedidoId, propostaId));
    return mapRawToProposta(data);
  },

  criar: async (pedidoId: number, payload: CriarPropostaPayload): Promise<Proposta> => {
    const { data } = await api.post<PropostaResponseRaw>(ENDPOINTS.CRIAR_PROPOSTA(pedidoId), payload);
    return mapRawToProposta(data);
  },

  aceitar: async (pedidoId: number, propostaId: number): Promise<AceitarPropostaResponseDTO> => {
    const { data } = await api.post<AceitarPropostaResponseDTO>(ENDPOINTS.ACEITAR_PROPOSTA(pedidoId, propostaId));
    return data;
  },

  recusar: async (pedidoId: number, propostaId: number): Promise<void> => {
    await api.patch(ENDPOINTS.RECUSAR_PROPOSTA(pedidoId, propostaId));
  },
};