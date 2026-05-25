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
      const key = ["pedidos-disponiveis", pageIndex, PAGE_SIZE, filtro];
      console.log("[DEBUG-d4f2] SWR key:", JSON.stringify(key));
      return key;
    },
    ([, pageIndex, size, f]) => {
      const params = f as PedidoFiltroParams | undefined;
      console.log("[DEBUG-d4f2] Calling listarDisponiveis → page:", pageIndex, "size:", size, "filtro:", JSON.stringify(params ?? {}));
      return orderService
        .listarDisponiveis(pageIndex as number, size as number, params)
        .then((data) => {
          console.log(
            "[DEBUG-d4f2] listarDisponiveis OK → totalElements:",
            data.totalElements,
            "contentLength:",
            data.content.length,
            "first:",
            data.first,
            "last:",
            data.last,
            "empty:",
            data.empty,
          );
          return data;
        })
        .catch((err) => {
          console.log("[DEBUG-d4f2] listarDisponiveis ERROR:", JSON.stringify(err?.response?.data ?? err?.message ?? err, null, 2));
          throw err;
        });
    },
  );

  const pedidos: PedidoResumoResponse[] = data?.flatMap((page) => page.content) ?? [];
  const hasMore = data ? !(data[data.length - 1]?.last) : true;
  const isLoadingMore = isValidating && data !== undefined && data.length > 0;

  console.log(
    "[DEBUG-d4f2] Hook state → isLoading:",
    isLoading,
    "isValidating:",
    isValidating,
    "dataPages:",
    data?.length ?? 0,
    "pedidosCount:",
    pedidos.length,
    "hasMore:",
    hasMore,
    "error:",
    error ? (error as Error).message ?? JSON.stringify(error) : null,
  );

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
