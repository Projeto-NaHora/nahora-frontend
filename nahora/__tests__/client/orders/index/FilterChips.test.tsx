import React from 'react';
import { render, screen } from '@tests/test-utils';
import FilterChips from '@/features/orders/components/FilterChips';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

describe('FilterChips', () => {
  test('renders all filter options', () => {
    render(<FilterChips selected="TODOS" onSelect={jest.fn()} />);

    expect(screen.getByText('Todos')).toBeOnTheScreen();
    expect(screen.getByText('Em aberto')).toBeOnTheScreen();
    expect(screen.getByText('Em andamento')).toBeOnTheScreen();
    expect(screen.getByText('Concluídos')).toBeOnTheScreen();
  });

  test('calls onSelect when chip pressed', () => {
    const onSelect = jest.fn();
    render(<FilterChips selected="TODOS" onSelect={onSelect} />);

    const abertoChip = screen.getByText('Em aberto');
    // Pressable is pressable
    const { fireEvent } = require('@testing-library/react-native');
    fireEvent.press(abertoChip);

    expect(onSelect).toHaveBeenCalledWith('ABERTO');
  });
});
