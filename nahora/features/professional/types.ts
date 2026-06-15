// features/professional/types.ts
import type { CategoriaServico, StatusPedido } from "@/types/enums";

/** Espelha PedidoDisponivelResponse do backend (GET /api/v1/pedidos/disponiveis) */
export interface PedidoDisponivelResponse {
  id: number;
  titulo: string; // descrição truncada (até 90 caracteres)
  criadoEm: string; // ISO 8601 (yyyy-MM-dd'T'HH:mm:ss)
  nomeCliente: string;
  avaliacaoCliente: number;
  distanciaKm: number;
  categoria: CategoriaServico;
  statusPedido: StatusPedido;
}

export type SortBy = "MAIS_PROXIMOS" | "MAIS_RECENTES" | "URGENTES";

export interface PedidoFiltroParams {
  categoria?: CategoriaFilter;
  urgente?: boolean;
  sortBy?: SortBy;
  /** Busca livre (case-insensitive) por descrição do pedido ou nome da categoria */
  termo?: string;
}

/** Tipo para exibição no card (apelido para o response do backend) */
export type PedidoDisponivel = PedidoDisponivelResponse;

export type CategoriaFilter = CategoriaServico | "TODAS";

export type UrgenciaFilter = "TODAS" | "URGENTE" | "NORMAL";
