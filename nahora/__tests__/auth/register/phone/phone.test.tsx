import React from 'react';
import { render, screen } from '@tests/test-utils';
import Screen from '@/app/(auth)/(register)/phone';
import { useRegisterStore } from '@/store/registerStore';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

jest.mock('@/features/auth/service', () => ({
  authService: {
    sendOtp: jest.fn().mockResolvedValue({}),
  },
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('PhoneScreen', () => {
  beforeEach(() => {
    useRegisterStore.setState({ phone: '' });
    jest.clearAllMocks();
  });

  test('renders title', () => {
    render(<Screen />);

    expect(screen.getByText('Qual o seu número?')).toBeOnTheScreen();
  });

  test('renders phone input', () => {
    render(<Screen />);

    expect(
      screen.getByPlaceholderText('(11) 99999-9999'),
    ).toBeOnTheScreen();
  });

  test('renders submit button', () => {
    render(<Screen />);

    expect(screen.getByText('Enviar')).toBeOnTheScreen();
  });
});
