import React from 'react';
import { render, screen } from '@tests/test-utils';
import Screen from '@/app/(auth)/(register)/password';
import { useRegisterStore } from '@/store/registerStore';
import { useAuthStore } from '@/store/authStore';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

jest.mock('@/features/auth/service', () => ({
  authService: {
    registerClient: jest.fn(),
  },
}));

jest.mock('@/utils/storage', () => ({
  set: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/utils/jwt', () => ({
  decodeJwtPayload: jest.fn(() => ({ id: 1, nome: 'João', tipo: 'CLIENTE' })),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

describe('PasswordScreen', () => {
  beforeEach(() => {
    useRegisterStore.setState({
      role: 'CLIENTE',
      phone: '81912345678',
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@email.com',
      password: '',
    });
    useAuthStore.setState({ accessToken: null, user: null });
    jest.clearAllMocks();
  });

  test('renders title', () => {
    render(<Screen />);

    expect(
      screen.getByText('Quase lá!\nDefina sua senha'),
    ).toBeOnTheScreen();
  });

  test('renders password inputs', () => {
    render(<Screen />);

    expect(
      screen.getByPlaceholderText('Digite sua senha'),
    ).toBeOnTheScreen();
    expect(
      screen.getByPlaceholderText('Confirmar senha'),
    ).toBeOnTheScreen();
  });

  test('renders confirm button', () => {
    render(<Screen />);

    expect(screen.getByText('Confirmar')).toBeOnTheScreen();
  });
});
