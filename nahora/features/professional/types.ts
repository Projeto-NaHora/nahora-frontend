// features/professional/types.ts
import type { CategoriaServico } from "@/types/enums";

/** Espelha PedidoResumoResponse do backend */
export interface PedidoResumoResponse {
  id: number;
  descricao: string;
  categoria: CategoriaServico;
  distanciaKm: number;
  dataPublicacao: string;
  urgente: boolean;
  faixaValorMin: number;
  faixaValorMax: number;
  contadorPropostas: number;
}

export type SortBy = "MAIS_PROXIMOS" | "MAIS_RECENTES" | "URGENTES";

export interface PedidoFiltroParams {
  categoria?: CategoriaFilter;
  urgente?: boolean;
  sortBy?: SortBy;
}

/** Tipo para exibição no card (enriquecido com clienteNome mockado) */
export interface PedidoDisponivel extends PedidoResumoResponse {
  clienteNome: string;
}

export type CategoriaFilter = CategoriaServico | "TODAS";

export type UrgenciaFilter = "TODAS" | "URGENTE" | "NORMAL";
