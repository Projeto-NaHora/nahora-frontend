// features/orders/hooks/useOrders.ts
import useSWR from "swr";
import { orderService } from "../service";

export function useOrders() {
  return useSWR("orders", orderService.listar, {
    dedupingInterval: 30_000, // 30 segundos — evita requisições duplicadas
  });
}

export function useOrderDetail(id: number) {
  return useSWR(id ? `order-${id}` : null, () => orderService.buscarPorId(id), {
    dedupingInterval: 10_000,
  });
}
