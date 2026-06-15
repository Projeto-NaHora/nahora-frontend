// features/professional/hooks/usePedidosDisponiveis.ts
import useSWRInfinite from "swr/infinite";
import { orderService } from "@/features/orders/service";
import type { PedidoDisponivelResponse, PedidoFiltroParams } from "../types";

const PAGE_SIZE = 20;

export function usePedidosDisponiveis(filtro?: PedidoFiltroParams) {
  const { data, size, setSize, isLoading, isValidating, error, mutate } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && previousPageData.last) return null;
      const key = ["pedidos-disponiveis", pageIndex, PAGE_SIZE, filtro];
      return key;
    },
    ([, pageIndex, size, f]) => {
      const params = f as PedidoFiltroParams | undefined;
      return orderService
        .listarDisponiveis(pageIndex as number, size as number, params)
    },
  );

  const pedidos: PedidoDisponivelResponse[] = data?.flatMap((page) => page.content) ?? [];
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
