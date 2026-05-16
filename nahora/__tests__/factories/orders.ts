import type { Pedido } from '@/features/orders/types';

export function createMockPedido(overrides?: Partial<Pedido>): Pedido {
  return {
    id: 1,
    titulo: 'Torradeira pifou',
    descricao: 'A torradeira não liga mais. Preciso de conserto urgente.',
    categoria: 'ELETRICA',
    urgencia: 'NORMAL',
    status: 'ABERTO',
    clienteId: 1,
    profissionalId: undefined as unknown as number,
    profissional: undefined as unknown as Pedido['profissional'],
    endereco: {
      logradouro: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      cep: '01001000',
    },
    criadoEm: '2026-05-15T10:00:00Z',
    atualizadoEm: '2026-05-15T10:00:00Z',
    ...overrides,
  };
}

export function createMockPedidoList(count = 3): Pedido[] {
  return Array.from({ length: count }, (_, i) =>
    createMockPedido({
      id: i + 1,
      titulo: `Serviço ${i + 1}`,
    }),
  );
}
