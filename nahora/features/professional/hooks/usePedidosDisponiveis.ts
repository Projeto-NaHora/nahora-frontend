// features/professional/hooks/usePedidosDisponiveis.ts
import useSWRInfinite from "swr/infinite";
import { orderService } from "@/features/orders/service";
import type { PedidoResumoResponse, PedidoDisponivel, PedidoFiltroParams } from "../types";

const CLIENTES_MOCK = [
  "Maria Silva",
  "João Lima",
  "Ana Costa",
  "Carlos Souza",
  "Fernanda Rocha",
];

const PAGE_SIZE = 20;

export function enrichWithMockData(
  pedidos: PedidoResumoResponse[] | undefined,
): PedidoDisponivel[] {
  if (!pedidos) return [];
  return pedidos.map((p, i) => ({
    ...p,
    clienteNome: CLIENTES_MOCK[i % CLIENTES_MOCK.length],
  }));
}

export function usePedidosDisponiveis(filtro?: PedidoFiltroParams) {
  const { data, size, setSize, isLoading, isValidating, error, mutate } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && previousPageData.last) return null;
      return ["pedidos-disponiveis", pageIndex, PAGE_SIZE, filtro];
    },
    ([, pageIndex, size, f]) => {
      const params = f as PedidoFiltroParams | undefined;
      return orderService.listarDisponiveis(pageIndex as number, size as number, params);
    },
  );

  const pedidos: PedidoResumoResponse[] = data?.flatMap((page) => page.content) ?? [];
  const hasMore = data ? !(data[data.length - 1]?.last) : true;
  const isLoadingMore = isValidating && data !== undefined && data.length > 0;

  return {
    pedidos,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    refresh: () => mutate(),
    loadMore: () => {
      if (!hasMore || isLoadingMore) return;
      setSize(size + 1);
    },
  };
}

export { CLIENTES_MOCK };
