// features/orders/cacheKeys.ts
// Cache keys centralizadas para SWR — usar estas em vez de strings inline.

export const ordersKeys = {
  /** Lista de pedidos do cliente autenticado */
  list: (status?: string, page = 0, size = 20): string => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.set("status", status);
    return `meus-pedidos?${params.toString()}`;
  },

  /** Detalhe de um pedido específico */
  detail: (id: number): string => `order-${id}`,

  /** Lista de serviços do profissional (meus-servicos) */
  meusServicos: "/pedidos/meus-servicos" as const,

  /** Status de disputa de um pedido */
  disputa: (pedidoId: number): string => `/disputas/pedido/${pedidoId}`,
};
