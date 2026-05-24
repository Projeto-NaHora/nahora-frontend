import React from 'react';
import { render, screen } from '@tests/test-utils';
import { userEvent } from '@testing-library/react-native';
import LoginScreen from '@/app/(auth)/(login)/index';
import { useAuthStore } from '@/store/authStore';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

jest.mock('@/features/auth/service', () => ({
  authService: {
    login: jest.fn().mockResolvedValue({
      accessToken: 'test-token',
      refreshToken: 'test-refresh',
      tipoUsuario: 'CLIENTE',
    }),
  },
}));

jest.mock('@/utils/storage', () => ({
  set: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/utils/jwt', () => ({
  decodeJwtPayload: jest.fn(() => ({
    id: 1,
    nome: 'João',
    tipo: 'CLIENTE',
  })),
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ accessToken: null, user: null });
  });

  test('renders welcome title', () => {
    render(<LoginScreen />);

    expect(screen.getByText('Bem-vindo(a)\nde volta!')).toBeOnTheScreen();
  });

  test('renders login form fields', () => {
    render(<LoginScreen />);

    expect(
      screen.getByPlaceholderText('E-mail ou número de telefone'),
    ).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Senha')).toBeOnTheScreen();
  });

  test('renders "Entrar" button', () => {
    render(<LoginScreen />);

    expect(screen.getByText('Entrar')).toBeOnTheScreen();
  });

  test('navigates to forgot password on link press', async () => {
    const user = userEvent.setup();
    render(<LoginScreen />);

    await user.press(screen.getByText('Esqueceu a senha?'));
    expect(mockPush).toHaveBeenCalledWith(
      '/(auth)/(forgotpassword)/email',
    );
  });

  test('navigates to register on signup press', async () => {
    const user = userEvent.setup();
    render(<LoginScreen />);

    await user.press(screen.getByText('Cadastre-se'));
    expect(mockPush).toHaveBeenCalledWith('/(auth)/(register)/role');
  });
});
