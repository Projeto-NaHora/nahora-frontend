import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type {
  SimularPagamentoRequest,
  PagamentoConfirmadoResponse,
} from "./types";

export const paymentsService = {
  /** SIMULADO — único endpoint de pagamento ativo */
  simular: async (
    pedidoId: number,
    payload: SimularPagamentoRequest,
  ): Promise<PagamentoConfirmadoResponse> => {
    const { data } = await api.post<PagamentoConfirmadoResponse>(
      ENDPOINTS.PAGAMENTO_SIMULAR(pedidoId),
      payload,
    );
    return data;
  },

  /** Baixa o recibo de pagamento em PDF (retorna bytes) */
  baixarRecibo: async (pedidoId: number): Promise<ArrayBuffer> => {
    const { data } = await api.get<ArrayBuffer>(
      ENDPOINTS.PEDIDO_RECIBO(pedidoId),
      { responseType: "arraybuffer" },
    );
    return data;
  },
};
