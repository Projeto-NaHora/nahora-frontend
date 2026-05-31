// features/orders/hooks/useOrders.ts
import useSWR from "swr";
import { orderService } from "../service";
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

/*
export const useProOrders = () => {
  return useSWR({
    queryKey: ["pedidos", "meus-servicos"],
    queryFn: () => orderService.listarMeusServicos(),
  });
};
*/

export function useOrderDetail(id: number) {
  return useSWR(id ? `order-${id}` : null, () => orderService.buscarPorId(id));
}
