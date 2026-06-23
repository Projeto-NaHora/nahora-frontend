import { api } from "@/services/api/client";
import { API_URL, ENDPOINTS } from "@/services/api/endpoints";
import { useAuthStore } from "@/store/authStore";
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

  /** Baixa o recibo de pagamento em PDF (retorna ArrayBuffer) */
  baixarRecibo: async (pedidoId: number): Promise<ArrayBuffer> => {
    const token = useAuthStore.getState().accessToken;
    const response = await fetch(`${API_URL}${ENDPOINTS.PEDIDO_RECIBO(pedidoId)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao baixar recibo: ${response.status}`);
    }

    return response.arrayBuffer();
  },
};
