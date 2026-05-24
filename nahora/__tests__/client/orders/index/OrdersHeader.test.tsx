import React from 'react';
import { render, screen } from '@tests/test-utils';
import OrdersHeader from '@/features/orders/components/OrdersHeader';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

describe('OrdersHeader', () => {
  test('renders title', () => {
    render(<OrdersHeader />);

    expect(screen.getByText('Meus Pedidos')).toBeOnTheScreen();
  });

  test('renders add button with + symbol', () => {
    render(<OrdersHeader />);

    expect(screen.getByText('+')).toBeOnTheScreen();
  });
});
