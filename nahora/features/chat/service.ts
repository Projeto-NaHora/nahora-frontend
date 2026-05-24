import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { Page } from "@/features/orders/types";
import type { MensagemPage, ConversaResponseDTO } from "./types";

export const conversationService = {
  listar: async (
    status = "ABERTA,SOMENTE_LEITURA,EM_DISPUTA,FECHADA",
    page = 0,
    size = 20,
  ): Promise<Page<ConversaResponseDTO>> => {
    const { data } = await api.get<Page<ConversaResponseDTO>>(
      ENDPOINTS.CONVERSAS,
      { params: { status, page, size } },
    );
    return data;
  },
};

export const chatService = {
  listarMensagens: async (
    conversaId: number,
    page = 0,
    size = 50,
  ): Promise<MensagemPage> => {
    const { data } = await api.get<MensagemPage>(
      ENDPOINTS.MENSAGENS(conversaId),
      { params: { page, size } },
    );
    return data;
  },

  buscarConversa: async (
    conversaId: number,
  ): Promise<ConversaResponseDTO> => {
    const { data } = await api.get<ConversaResponseDTO>(
      ENDPOINTS.CONVERSA(conversaId),
    );
    return data;
  },
};
