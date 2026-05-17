import React from 'react';
import { render, screen } from '@tests/test-utils';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/features/orders/hooks/useOrders', () => ({
  useOrders: () => ({
    data: {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 20,
      first: true,
      last: true,
      empty: true,
    },
    isLoading: false,
    isValidating: false,
    error: undefined,
    mutate: jest.fn(),
  }),
}));

describe('OrdersScreen', () => {
  test('renders header with title', () => {
    render(<OrdersScreen />);

    expect(screen.getByText('Meus Pedidos')).toBeOnTheScreen();
  });

  test('renders add button', () => {
    render(<OrdersScreen />);

    expect(screen.getAllByText('+').length).toBeGreaterThan(0);
  });

  test('renders filter chips', () => {
    render(<OrdersScreen />);

    expect(screen.getByText('Todos')).toBeOnTheScreen();
    expect(screen.getByText('Em aberto')).toBeOnTheScreen();
  });
});

import OrdersScreen from '@/app/(client)/(orders)/index';
