import type { Pedido, Page } from '@/features/orders/types';

export function createMockPedido(overrides?: Partial<Pedido>): Pedido {
  return {
    id: 1,
    clienteId: 1,
    clienteNome: 'João Silva',
    categoria: 'ELETRICA',
    descricao: 'A torradeira não liga mais. Preciso de conserto urgente.',
    fotos: [],
    endereco: {
      logradouro: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      cep: '01001000',
    },
    urgencia: 'NORMAL',
    orcamentoEstimado: null,
    dataDesejada: '2026-05-22T08:00:00Z',
    status: 'ABERTO',
    criadoEm: '2026-05-15T10:00:00Z',
    ...overrides,
  };
}

export function createMockPedidoList(count = 3): Pedido[] {
  return Array.from({ length: count }, (_, i) =>
    createMockPedido({ id: i + 1 }),
  );
}

export function createMockPedidoPage(
  count = 3,
  totalElements = 3,
  page = 0,
  size = 20,
): Page<Pedido> {
  return {
    content: createMockPedidoList(count),
    totalElements,
    totalPages: Math.ceil(totalElements / size),
    number: page,
    size,
    first: page === 0,
    last: page * size + count >= totalElements,
    empty: count === 0,
  };
}
