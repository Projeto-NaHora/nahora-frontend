// features/professional/hooks/usePedidosDisponiveis.ts
import useSWR from "swr";
import { orderService } from "@/features/orders/service";
import type { Page } from "@/features/orders/types";
import type { PedidoResumoResponse, PedidoDisponivel } from "../types";

const CLIENTES_MOCK = [
  "Maria Silva",
  "João Lima",
  "Ana Costa",
  "Carlos Souza",
  "Fernanda Rocha",
];

export function enrichWithMockData(
  pedidos: PedidoResumoResponse[] | undefined,
): PedidoDisponivel[] {
  if (!pedidos) return [];
  return pedidos.map((p, i) => ({
    ...p,
    clienteNome: CLIENTES_MOCK[i % CLIENTES_MOCK.length],
  }));
}

export function usePedidosDisponiveis(page: number = 0, size: number = 20) {
  return useSWR(
    ["pedidos-disponiveis", page, size],
    () => orderService.listarDisponiveis(page, size),
  );
}

export { CLIENTES_MOCK };
