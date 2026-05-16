import React from 'react';
import { render, screen } from '@tests/test-utils';
import EmptyOrders from '@/features/orders/components/EmptyOrders';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

describe('EmptyOrders', () => {
  test('renders default message', () => {
    render(<EmptyOrders />);

    expect(
      screen.getByText('Nenhum pedido encontrado'),
    ).toBeOnTheScreen();
  });

  test('renders custom message', () => {
    render(<EmptyOrders message="Você ainda não tem pedidos" />);

    expect(
      screen.getByText('Você ainda não tem pedidos'),
    ).toBeOnTheScreen();
  });
});
