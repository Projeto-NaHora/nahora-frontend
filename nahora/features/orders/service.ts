// features/orders/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { Pedido, CriarPedidoPayload } from "./types";

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
   * Lista todos os pedidos associados ao usuário logado (cliente ou profissional).
   */
  listar: async (): Promise<Pedido[]> => {
    const { data } = await api.get<Pedido[]>(ENDPOINTS.PEDIDOS);
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
   * Faz upload de um arquivo de mídia (imagem/vídeo) e retorna a URL pública.
   */
  uploadMidia: async (uri: string): Promise<string> => {
    const formData = new FormData();
    const filename = uri.split("/").pop() ?? "upload.jpg";
    const mimeType = mimeTypeFromUri(uri);

    formData.append("file", {
      uri,
      name: filename,
      type: mimeType,
    } as unknown as Blob);

    const { data } = await api.post<{ url: string }>(
      ENDPOINTS.UPLOAD_DOCUMENTO,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return data.url;
  },
};
