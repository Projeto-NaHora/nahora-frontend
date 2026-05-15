// features/orders/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { Pedido, CriarPedidoPayload } from "./types";

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
};
