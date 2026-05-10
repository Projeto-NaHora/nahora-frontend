// features/orders/hooks/useOrders.ts
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../service";

export const ordersKeys = {
  all: ["orders"] as const,
  detail: (id: number) => ["orders", id] as const,
};

export function useOrders() {
  return useQuery({
    queryKey: ordersKeys.all,
    queryFn: orderService.listar,
    staleTime: 30_000, // 30 segundos — pedidos mudam com moderada frequência
  });
}

export function useOrderDetail(id: number) {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => orderService.buscarPorId(id),
    staleTime: 10_000,
  });
}
