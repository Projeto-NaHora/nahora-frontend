// features/orders/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { Pedido, CriarPedidoPayload, Page } from "./types";
import type { PedidoResumoResponse } from "@/features/professional/types";

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
   * Cancela um pedido aberto.
   */
  cancelar: async (id: number): Promise<void> => {
    await api.patch(`${ENDPOINTS.PEDIDO(id)}/cancelar`);
  },

  /**
   * Lista pedidos disponíveis para profissionais aceitarem.
   */
  listarDisponiveis: async (
    page: number = 0,
    size: number = 20,
  ): Promise<Page<PedidoResumoResponse>> => {
    const { data } = await api.get<Page<PedidoResumoResponse>>(
      ENDPOINTS.PEDIDOS_DISPONIVEIS,
      { params: { page, size } },
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
