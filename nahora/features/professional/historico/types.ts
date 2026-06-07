// features/professional/historico/types.ts

import type { CategoriaServico, StatusPedido } from "@/types/enums";

/** GET /api/v1/profissionais/historico/ganhos?mes={MM}&ano={YYYY} */
export interface GanhosMensaisResponse {
  mes: number;
  ano: number;
  valorTotal: number | string;
  totalConcluidos: number;
  totalServicos: number;
}

/** GET /api/v1/profissionais/historico/servicos?mes={MM}&ano={YYYY} */
export interface ServicoHistoricoResponse {
  id: number;
  categoria: CategoriaServico;
  descricao: string;
  dataRealizacao: string; // ISO date string
  valorRecebido: number | string;
  status: StatusPedido;
  clienteNome: string;
  clienteIniciais: string;
}
