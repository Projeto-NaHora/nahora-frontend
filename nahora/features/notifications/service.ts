// features/notifications/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { NotificacaoDTO } from "./types";

export const notificationService = {
  async listar(): Promise<NotificacaoDTO[]> {
    const { data } = await api.get<NotificacaoDTO[]>(ENDPOINTS.NOTIFICACOES);
    return data;
  },

  async marcarLida(id: number): Promise<void> {
    await api.put(ENDPOINTS.MARCAR_LIDA(id));
  },

  async marcarTodasLidas(): Promise<void> {
    await api.put(`${ENDPOINTS.NOTIFICACOES}/lidas`);
  },

  async limparTodas(): Promise<void> {
    await api.delete(ENDPOINTS.NOTIFICACOES);
  },
};