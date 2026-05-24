import React from 'react';
import { render, screen } from '@tests/test-utils';
import Screen from '@/app/(auth)/(register)/name';
import { useRegisterStore } from '@/store/registerStore';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('NameScreen', () => {
  beforeEach(() => {
    useRegisterStore.setState({ firstName: '', lastName: '' });
    jest.clearAllMocks();
  });

  test('renders title', () => {
    render(<Screen />);

    expect(screen.getByText('Qual seu nome?')).toBeOnTheScreen();
  });

  test('renders name inputs', () => {
    render(<Screen />);

    expect(screen.getByPlaceholderText('Nome')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Sobrenome')).toBeOnTheScreen();
  });

  test('renders confirm button', () => {
    render(<Screen />);

    expect(screen.getByText('Confirmar')).toBeOnTheScreen();
  });
});
