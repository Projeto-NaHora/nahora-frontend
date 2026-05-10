import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { StatusPedido, CategoriaServico, Urgencia } from "@/types/enums";

// 1. Define the DTOs (Data Transfer Objects) mirroring the backend
export interface Pedido {
  id: number;
  titulo: string;
  descricao: string;
  categoria: CategoriaServico;
  urgencia: Urgencia;
  status: StatusPedido;
  clienteId: number;
  profissionalId?: number | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CriarPedidoPayload {
  titulo: string;
  descricao: string;
  categoria: CategoriaServico;
  urgencia: Urgencia;
  enderecoId: number; // Assuming address is handled by ID
}

// 2. Implement the Service
export const orderService = {
  /**
   * Lista todos os pedidos associados ao usuário logado.
   * Usado pelo hook useOrders()
   */
  listar: async (): Promise<Pedido[]> => {
    // Note: If your Spring Boot backend uses Pageable, you might need to adjust
    // this to expect a PaginatedResponse<Pedido> instead of an array.
    const { data } = await api.get<Pedido[]>(ENDPOINTS.PEDIDOS);
    return data;
  },

  /**
   * Busca os detalhes de um pedido específico.
   * Usado pelo hook useOrderDetail(id)
   */
  buscarPorId: async (id: number): Promise<Pedido> => {
    const { data } = await api.get<Pedido>(ENDPOINTS.PEDIDO(id));
    return data;
  },

  /**
   * Cria um novo pedido (Ação exclusiva de CLIENTE).
   */
  criar: async (payload: CriarPedidoPayload): Promise<Pedido> => {
    const { data } = await api.post<Pedido>(ENDPOINTS.PEDIDOS, payload);
    return data;
  },

  /**
   * Cancela um pedido aberto.
   */
  cancelar: async (id: number): Promise<void> => {
    // Adicione a rota apropriada no seu ENDPOINTS, ex: `/pedidos/${id}/cancelar`
    await api.patch(`${ENDPOINTS.PEDIDO(id)}/cancelar`);
  },
};
