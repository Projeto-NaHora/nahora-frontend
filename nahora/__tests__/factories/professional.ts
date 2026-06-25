import type { PedidoDisponivelResponse } from "@/features/professional/types";
import type { Page } from "@/features/orders/types";

export function createMockPedidoDisponivel(
  overrides?: Partial<PedidoDisponivelResponse>,
): PedidoDisponivelResponse {
  return {
    id: 1,
    titulo: "Instalar tomadas no quarto e sala. Tenho os materiais.",
    categoria: "ELETRICA",
    distanciaKm: 1.2,
    criadoEm: "2026-05-17T10:00:00",
    nomeCliente: "Maria Silva",
    avaliacaoCliente: 4.8,
    statusPedido: "ABERTO",
    ...overrides,
  };
}

function createMockPedidoDisponivelList(
  count = 3,
): PedidoDisponivelResponse[] {
  return Array.from({ length: count }, (_, i) =>
    createMockPedidoDisponivel({
      id: i + 1,
      titulo: `Descrição do pedido ${i + 1}`,
      distanciaKm: 1.2 + i * 1.5,
      nomeCliente: ["Maria Silva", "João Lima", "Ana Costa"][i % 3],
    }),
  );
}

export function createMockPedidoDisponivelPage(
  count = 3,
  totalElements = 3,
  page = 0,
  size = 20,
): Page<PedidoDisponivelResponse> {
  return {
    content: createMockPedidoDisponivelList(count),
    totalElements,
    totalPages: Math.ceil(totalElements / size),
    number: page,
    size,
    first: page === 0,
    last: page * size + count >= totalElements,
    empty: count === 0,
  };
}
