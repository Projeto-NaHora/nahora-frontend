// features/orders/hooks/useOrders.ts
import useSWR from "swr";
import { disputaService, orderService } from "../service";
import { STATUS_FILTER_MAP } from "../types";
import type { FiltroStatus } from "../types";

interface UseOrdersParams {
  status?: FiltroStatus;
  page?: number;
  size?: number;
}

export function useOrders(params: UseOrdersParams = {}) {
  const { status = "TODOS", page = 0, size = 20 } = params;
  const statusParam = STATUS_FILTER_MAP[status];

  const key = statusParam
    ? `meus-pedidos?status=${statusParam}&page=${page}&size=${size}`
    : `meus-pedidos?page=${page}&size=${size}`;

  return useSWR(key, () =>
    orderService.listarMeusPedidos(statusParam || undefined, page, size),
  );
}

export const useAvailableOrders = () => {
  return useSWR({
    queryKey: ["pedidos", "disponiveis"],
    queryFn: () => orderService.listarDisponiveis(),
  });
};

export const useDisputaStatus = (pedidoId: number | null) => {
  const { data, error, mutate, isLoading } = useSWR(
    pedidoId ? `/disputas/pedido/${pedidoId}` : null,
    () => disputaService.buscarStatusPorPedido(pedidoId!),
  );

  return {
    disputa: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useProOrders = () => {
  // No SWR, passamos a chave (pode ser a rota) e o fetcher (a função que chama a API)
  const { data, error, mutate, isValidating } = useSWR(
    "/pedidos/meus-servicos",
    () => orderService.listarMeusServicos(),
  );

  return {
    data,
    isLoading: !data && !error, // Se não tem dados e não tem erro, está carregando
    isError: error,
    mutate,
  };
};

export function useOrderDetail(id: number) {
  return useSWR(id ? `order-${id}` : null, () => orderService.buscarPorId(id));
}
