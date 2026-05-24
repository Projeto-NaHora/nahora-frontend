import React from 'react';
import { render, screen } from '@tests/test-utils';
import { PasswordContent } from '@/features/auth/components/PasswordContent';
import { useForm } from 'react-hook-form';
import type { RegisterPasswordFormValues } from '@/features/auth/types';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

describe('PasswordContent', () => {
  function TestHarness({
    isSubmitting = false,
    error = undefined as string | null | undefined,
    errorStatus = undefined as number | null | undefined,
  } = {}) {
    const { control } = useForm<RegisterPasswordFormValues>({
      defaultValues: { password: '', confirmPassword: '' },
    });
    return (
      <PasswordContent
        control={control}
        isSubmitting={isSubmitting}
        onSubmit={jest.fn()}
        error={error}
        errorStatus={errorStatus}
      />
    );
  }

  test('renders title', () => {
    render(<TestHarness />);

    expect(screen.getByText('Quase lá!\nDefina sua senha')).toBeOnTheScreen();
  });

  test('renders two password inputs', () => {
    render(<TestHarness />);

    expect(screen.getByPlaceholderText('Digite sua senha')).toBeOnTheScreen();
    expect(
      screen.getByPlaceholderText('Confirmar senha'),
    ).toBeOnTheScreen();
  });

  test('renders confirm button', () => {
    render(<TestHarness />);

    expect(screen.getByText('Confirmar')).toBeOnTheScreen();
  });

  test('shows error banner when error provided', () => {
    render(
      <TestHarness error="Erro no cadastro" errorStatus={409} />,
    );

    expect(screen.getByText('Erro ao cadastrar')).toBeOnTheScreen();
    expect(screen.getByText('Erro no cadastro')).toBeOnTheScreen();
  });

  test('disables button when isSubmitting', () => {
    render(<TestHarness isSubmitting={true} />);

    expect(screen.getByText('Confirmar')).toBeDisabled();
  });
});
