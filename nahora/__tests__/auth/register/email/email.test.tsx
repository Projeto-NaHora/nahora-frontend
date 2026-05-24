import React from 'react';
import { render, screen } from '@tests/test-utils';
import Screen from '@/app/(auth)/(register)/email';
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

describe('EmailScreen', () => {
  beforeEach(() => {
    useRegisterStore.setState({ email: '' });
    jest.clearAllMocks();
  });

  test('renders title', () => {
    render(<Screen />);

    expect(screen.getByText('Qual o seu e-mail?')).toBeOnTheScreen();
  });

  test('renders email input', () => {
    render(<Screen />);

    expect(
      screen.getByPlaceholderText('email@exemplo.com'),
    ).toBeOnTheScreen();
  });

  test('renders submit button', () => {
    render(<Screen />);

    expect(screen.getByText('Continuar')).toBeOnTheScreen();
  });
});
