// features/orders/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type {
  Pedido,
  PedidoPublicoResponse,
  CriarPedidoPayload,
  EditarPedidoPayload,
  Page,
} from "./types";
import type {
  PedidoDisponivelResponse,
  PedidoFiltroParams,
} from "@/features/professional/types";

/** Helper para extrair o tipo MIME a partir da extensão do arquivo */
function mimeTypeFromUri(uri: string): string {
  const ext = uri.split(".").pop()?.toLowerCase() ?? "jpg";
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    mp4: "video/mp4",
    mov: "video/quicktime",
  };
  return map[ext] ?? "image/jpeg";
}

export const orderService = {
  /**
   * Lista os pedidos do cliente autenticado (GET /pedidos/meus).
   */
  listarMeusPedidos: async (
    status?: string,
    page: number = 0,
    size: number = 20,
  ): Promise<Page<Pedido>> => {
    const params: Record<string, string | number> = { page, size };
    if (status) params.status = status;
    const { data } = await api.get<Page<Pedido>>(ENDPOINTS.MEUS_PEDIDOS, {
      params,
    });
    return data;
  },

  /**
   * Busca os detalhes de um pedido específico.
   */
  buscarPorId: async (id: number): Promise<Pedido> => {
    const { data } = await api.get<Pedido>(ENDPOINTS.PEDIDO(id));
    return data;
  },

  /**
   * Cria um novo pedido (ação exclusiva de CLIENTE).
   */
  criar: async (payload: CriarPedidoPayload): Promise<Pedido> => {
    const { data } = await api.post<Pedido>(ENDPOINTS.PEDIDOS, payload);
    return data;
  },

  /**
   * Cancela um pedido aberto (DELETE /pedidos/{pedidoId}).
   */
  cancelar: async (id: number): Promise<void> => {
    await api.delete(ENDPOINTS.PEDIDO(id));
  },

  /* Todo: Atualizar com o endpoint correto do backend */
  confirmarConclusao: async (id: number): Promise<void> => {
    await api.post(`${ENDPOINTS.PEDIDO(id)}/confirmar-conclusao`);
  },

  reportarProblema: async (
    id: number,
    payload?: { motivo: string; descricao: string; evidencias: string[] },
  ): Promise<void> => {
    await api.post(`${ENDPOINTS.PEDIDO(id)}/reportar-problema`, payload);
  },

  /**
   * Atualiza um pedido aberto (PUT /pedidos/{pedidoId}).
   */
  atualizar: async (
    id: number,
    payload: EditarPedidoPayload,
  ): Promise<Pedido> => {
    const { data } = await api.put<Pedido>(ENDPOINTS.PEDIDO(id), payload);
    return data;
  },

  concluirServico: async (id: number): Promise<void> => {
    await api.post(`${ENDPOINTS.PEDIDO(id)}/concluir`);
  },
  /**
   * Lista pedidos disponíveis para profissionais aceitarem.
   */
  listarDisponiveis: async (
    page: number = 0,
    size: number = 20,
    filtro?: PedidoFiltroParams,
  ): Promise<Page<PedidoDisponivelResponse>> => {
    const params: Record<string, string | number | boolean> = { page, size };
    if (filtro?.categoria && filtro.categoria !== "TODAS")
      params.categoria = filtro.categoria;
    if (filtro?.urgente !== undefined && filtro.urgente !== null)
      params.urgente = filtro.urgente;
    if (filtro?.sortBy) params.sortBy = filtro.sortBy;
    if (filtro?.termo && filtro.termo.trim().length >= 2)
      params.termo = filtro.termo.trim();
    const { data } = await api.get<Page<PedidoDisponivelResponse>>(
      ENDPOINTS.PEDIDOS_DISPONIVEIS,
      { params },
    );
    return data;
  },

  listarMeusServicos: async (page = 0, size = 20, status?: string) => {
    const params: Record<string, string | number> = { page, size };
    if (status) params.status = status;
    const { data } = await api.get("/pedidos/meus-servicos", {
      params,
    });
    return data;
  },

  /**
   * Busca detalhes públicos de um pedido (sem autenticação).
   */
  buscarPedidoPublico: async (id: number): Promise<PedidoPublicoResponse> => {
    const { data } = await api.get<PedidoPublicoResponse>(
      ENDPOINTS.PEDIDO_PUBLICO(id),
    );
    return data;
  },

  /**
   * Faz upload de um arquivo de mídia (imagem/vídeo) e retorna a URL pública.
   */
  uploadMidia: async (uri: string, tipo: string): Promise<string> => {
    const formData = new FormData();
    const filename = uri.split("/").pop() ?? "upload.jpg";
    const mimeType = mimeTypeFromUri(uri);

    formData.append("file", {
      uri,
      name: filename,
      type: mimeType,
    } as unknown as Blob);
    formData.append("tipo", tipo);

    const { data } = await api.post<{ url: string }>(
      ENDPOINTS.UPLOAD_DOCUMENTO,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return data.url;
  },
};

export const disputaService = {
  buscarStatusPorPedido: async (pedidoId: number) => {
    const { data } = await api.get(`/disputas/pedido/${pedidoId}`);
    return data;
  },

  contestar: async (disputaId: number, justificativa: string, evidenciasAdicionais: string[]) => {
    const { data } = await api.post(`/disputas/${disputaId}/contestar`, {
      justificativa,
      evidenciasAdicionais,
    });
    return data;
  },
};
