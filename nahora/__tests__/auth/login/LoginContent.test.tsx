import React from 'react';
import { render, screen } from '@tests/test-utils';
import { userEvent } from '@testing-library/react-native';
import { LoginContent } from '@/features/auth/components/LoginContent';
import { useForm, type Control } from 'react-hook-form';
import type { LoginFormValues } from '@/features/auth/types';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

function TestHarness({
  isSubmitting = false,
  error = undefined as string | null | undefined,
  errorStatus = undefined as number | null | undefined,
  onSubmit = undefined as (() => void) | undefined,
  onForgotPassword = undefined as (() => void) | undefined,
  onRegister = undefined as (() => void) | undefined,
}: {
  isSubmitting?: boolean;
  error?: string | null;
  errorStatus?: number | null;
  onSubmit?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
} = {}) {
  const { control } = useForm<LoginFormValues>({
    defaultValues: { identificador: '', password: '' },
  });
  return (
    <LoginContent
      control={control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit ?? jest.fn()}
      onForgotPassword={onForgotPassword ?? jest.fn()}
      onRegister={onRegister ?? jest.fn()}
      error={error}
      errorStatus={errorStatus}
    />
  );
}

describe('LoginContent', () => {

  test('renders welcome title', () => {
    render(<TestHarness />);

    expect(screen.getByText('Bem-vindo(a)\nde volta!')).toBeOnTheScreen();
  });

  test('renders identifier and password inputs', () => {
    render(<TestHarness />);

    expect(
      screen.getByPlaceholderText('E-mail ou número de telefone'),
    ).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Senha')).toBeOnTheScreen();
  });

  test('renders forgot password link', () => {
    render(<TestHarness />);

    expect(screen.getByText('Esqueceu a senha?')).toBeOnTheScreen();
  });

  test('renders signup link in footer', () => {
    render(<TestHarness />);

    expect(screen.getByText('Não tem uma conta?')).toBeOnTheScreen();
    expect(screen.getByText('Cadastre-se')).toBeOnTheScreen();
  });

  test('calls onForgotPassword when link pressed', async () => {
    const user = userEvent.setup();
    const onForgotPassword = jest.fn();

    render(<TestHarness onForgotPassword={onForgotPassword} />);

    await user.press(screen.getByText('Esqueceu a senha?'));
    expect(onForgotPassword).toHaveBeenCalledTimes(1);
  });

  test('calls onRegister when signup link pressed', async () => {
    const user = userEvent.setup();
    const onRegister = jest.fn();

    render(<TestHarness onRegister={onRegister} />);

    await user.press(screen.getByText('Cadastre-se'));
    expect(onRegister).toHaveBeenCalledTimes(1);
  });

  test('shows "Entrando..." when submitting', () => {
    render(
      <TestHarness isSubmitting={true} />,
    );

    expect(screen.getByText('Entrando...')).toBeOnTheScreen();
  });

  test('shows "Entrar" when not submitting', () => {
    render(
      <TestHarness isSubmitting={false} />,
    );

    expect(screen.getByText('Entrar')).toBeOnTheScreen();
  });

  test('shows error banner when error provided', () => {
    render(
      <TestHarness error="Credenciais inválidas" errorStatus={401} />,
    );

    expect(screen.getByText('Erro ao entrar')).toBeOnTheScreen();
    expect(screen.getByText('Credenciais inválidas')).toBeOnTheScreen();
  });

  test('does not show error banner when no error', () => {
    render(
      <TestHarness error={null} />,
    );

    expect(screen.queryByText('Erro ao entrar')).not.toBeOnTheScreen();
  });
});
