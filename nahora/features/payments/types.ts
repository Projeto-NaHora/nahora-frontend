import type { MetodoPagamento, StatusPagamento } from "@/types/enums";

/** Request body para o endpoint simulado de pagamento */
export interface SimularPagamentoRequest {
  metodo: MetodoPagamento;
  parcelas?: number;
  salvarCartao?: boolean;
}

/** Espelha PagamentoConfirmadoResponse do backend — resposta do /simular */
export interface PagamentoConfirmadoResponse {
  pagamentoId: number;
  status: StatusPagamento;
  valor: number;
  metodo: MetodoPagamento;
  parcelas: number | null;
  dataPagamento: string | null;
  codigoTransacao: string | null;
  prestadorNome: string;
}
