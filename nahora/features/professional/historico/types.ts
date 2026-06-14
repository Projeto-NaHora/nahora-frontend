// features/professional/historico/types.ts
// Aligned with backend DTOs:
//   GanhosMesResponse.java – GET /api/v1/profissionais/historico/ganhos
//   ServicoMesResponse.java  – GET /api/v1/profissionais/historico/servicos

/** GET /api/v1/profissionais/historico/ganhos?mes={MM}&ano={YYYY} */
export interface GanhosMensaisResponse {
  mes: number;
  ano: number;
  totalRecebido: number | string;
  totalServicos: number;
  taxaConclusao: number; // percentage, e.g. 85.5
}

/** GET /api/v1/profissionais/historico/servicos?mes={MM}&ano={YYYY} */
export interface ServicoMesResponse {
  pedidoId: number;
  titulo: string;
  clienteNome: string;
  clienteIniciais: string;
  clienteFotoUrl?: string;
  dataPagamento: string; // yyyy-MM-dd
  valorRecebido: number | string;
  statusPagamento: string; // "RECEBIDO" | "PENDENTE" | "CAPTURADO" | ...
}

/** @deprecated Use ServicoMesResponse instead */
export type ServicoHistoricoResponse = ServicoMesResponse;

/** Spring Page wrapper returned by the servicos endpoint */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
