// features/orders/hooks/useOrders.ts
import useSWR from "swr";
import { disputaService, orderService } from "../service";
import { STATUS_FILTER_MAP, ordersKeys } from "../types";
import type { FiltroStatus } from "../types";

interface UseOrdersParams {
  status?: FiltroStatus;
  page?: number;
  size?: number;
}

export function useOrders(params: UseOrdersParams = {}) {
  const { status = "TODOS", page = 0, size = 20 } = params;
  const statusParam = STATUS_FILTER_MAP[status];

  const key = ordersKeys.list(statusParam ?? undefined, page, size);

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
    pedidoId ? ordersKeys.disputa(pedidoId) : null,
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
  const { data, error, mutate, isValidating } = useSWR(
    ordersKeys.meusServicos,
    () => orderService.listarMeusServicos(),
  );

  return {
    data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  };
};

export function useOrderDetail(id: number) {
  return useSWR(
    id ? ordersKeys.detail(id) : null,
    () => orderService.buscarPorId(id),
  );
}
