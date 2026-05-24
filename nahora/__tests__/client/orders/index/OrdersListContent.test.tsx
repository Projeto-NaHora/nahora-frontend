import React from 'react';
import { render, screen, fireEvent } from '@tests/test-utils';
import OrdersListContent from '@/features/orders/components/OrdersListContent';
import { createMockPedido, createMockPedidoPage } from '@tests/factories/orders';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

const mockMutate = jest.fn();

jest.mock('@/features/orders/hooks/useOrders', () => ({
  useOrders: jest.fn(),
}));

import { useOrders } from '@/features/orders/hooks/useOrders';

describe('OrdersListContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    (useOrders as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isValidating: false,
      error: undefined,
      mutate: mockMutate,
    });

    render(<OrdersListContent />);
    // ActivityIndicator renders with accessibility role
    expect(screen.UNSAFE_getByType(
      require('react-native').ActivityIndicator,
    )).toBeTruthy();
  });

  test('renders orders from paginated data', () => {
    const page = createMockPedidoPage(2);
    (useOrders as jest.Mock).mockReturnValue({
      data: page,
      isLoading: false,
      isValidating: false,
      error: undefined,
      mutate: mockMutate,
    });

    render(<OrdersListContent />);

    const items = screen.getAllByText('Instalação elétrica');
    expect(items.length).toBe(2);
  });

  test('renders empty state when page is empty', () => {
    const page = createMockPedidoPage(0);
    (useOrders as jest.Mock).mockReturnValue({
      data: page,
      isLoading: false,
      isValidating: false,
      error: undefined,
      mutate: mockMutate,
    });

    render(<OrdersListContent />);

    expect(screen.getByText('Nenhum pedido encontrado')).toBeOnTheScreen();
  });

  test('renders filter chips and switches filter', () => {
    (useOrders as jest.Mock).mockReturnValue({
      data: createMockPedidoPage(0),
      isLoading: false,
      isValidating: false,
      error: undefined,
      mutate: mockMutate,
    });

    render(<OrdersListContent />);

    expect(screen.getByText('Todos')).toBeOnTheScreen();
    expect(screen.getByText('Em aberto')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('Em aberto'));
    // After chip press, useOrders should be called with status: 'ABERTO'
    // The component re-renders with the same mock, so the hook gets called again
    expect(useOrders).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'ABERTO' }),
    );
  });
});
