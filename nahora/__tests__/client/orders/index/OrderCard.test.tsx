import React from 'react';
import { render, screen } from '@tests/test-utils';
import OrderCard from '@/features/orders/components/OrderCard';
import { createMockPedido } from '@tests/factories/orders';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

describe('OrderCard', () => {
  test('renders category label', () => {
    const pedido = createMockPedido({ categoria: 'ELETRICA' });
    render(<OrderCard pedido={pedido} onPress={jest.fn()} />);

    expect(screen.getByText('Instalação elétrica')).toBeOnTheScreen();
  });

  test('renders status badge', () => {
    const pedido = createMockPedido({ status: 'ABERTO' });
    render(<OrderCard pedido={pedido} onPress={jest.fn()} />);

    expect(screen.getByText('Em aberto')).toBeOnTheScreen();
  });

  test('renders dataDesejada formatted with period', () => {
    // 17:00 UTC = 14:00 BRT = Tarde
    const pedido = createMockPedido({ dataDesejada: '2026-05-22T17:00:00Z' });
    render(<OrderCard pedido={pedido} onPress={jest.fn()} />);

    expect(screen.getByText(/22\/05\/2026/)).toBeOnTheScreen();
    expect(screen.getByText(/Tarde/)).toBeOnTheScreen();
  });

  test('renders description text', () => {
    const pedido = createMockPedido({
      descricao: 'A torradeira não liga mais.',
    });
    render(<OrderCard pedido={pedido} onPress={jest.fn()} />);

    expect(
      screen.getByText('A torradeira não liga mais.'),
    ).toBeOnTheScreen();
  });

  test('renders address when present', () => {
    const pedido = createMockPedido({
      status: 'EM_ANDAMENTO',
      endereco: {
        logradouro: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        cep: '01001000',
      },
    });
    render(<OrderCard pedido={pedido} onPress={jest.fn()} />);

    expect(
      screen.getByText('Rua das Flores, 123 - Centro, São Paulo'),
    ).toBeOnTheScreen();
  });

  test('does not render address when endereco is null', () => {
    const pedido = createMockPedido({ endereco: null });
    render(<OrderCard pedido={pedido} onPress={jest.fn()} />);

    expect(screen.queryByText(/Rua/)).not.toBeOnTheScreen();
  });
});
