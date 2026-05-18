import type { PedidoResumoResponse } from "@/features/professional/types";
import type { Page } from "@/features/orders/types";

export function createMockPedidoResumo(
  overrides?: Partial<PedidoResumoResponse>,
): PedidoResumoResponse {
  return {
    id: 1,
    descricao: "Instalar tomadas no quarto e sala. Tenho os materiais.",
    categoria: "ELETRICA",
    distanciaKm: 1.2,
    dataPublicacao: "2026-05-17T10:00:00Z",
    urgente: true,
    faixaValorMin: 50,
    faixaValorMax: 150,
    contadorPropostas: 2,
    ...overrides,
  };
}

export function createMockPedidoResumoList(
  count = 3,
): PedidoResumoResponse[] {
  return Array.from({ length: count }, (_, i) =>
    createMockPedidoResumo({
      id: i + 1,
      descricao: `Descrição do pedido ${i + 1}`,
      urgente: i === 0,
      distanciaKm: 1.2 + i * 1.5,
    }),
  );
}

export function createMockPedidoResumoPage(
  count = 3,
  totalElements = 3,
  page = 0,
  size = 20,
): Page<PedidoResumoResponse> {
  return {
    content: createMockPedidoResumoList(count),
    totalElements,
    totalPages: Math.ceil(totalElements / size),
    number: page,
    size,
    first: page === 0,
    last: page * size + count >= totalElements,
    empty: count === 0,
  };
}
