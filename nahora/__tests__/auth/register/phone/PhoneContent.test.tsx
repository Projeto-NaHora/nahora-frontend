import React from 'react';
import { render, screen } from '@tests/test-utils';
import { userEvent } from '@testing-library/react-native';
import { PhoneContent } from '@/features/auth/components/PhoneContent';
import { useForm } from 'react-hook-form';
import type { RegisterPhoneFormValues } from '@/features/auth/types';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

describe('PhoneContent', () => {
  function TestHarness({
    isSubmitting = false,
    error = undefined as string | null | undefined,
    errorStatus = undefined as number | null | undefined,
  } = {}) {
    const { control } = useForm<RegisterPhoneFormValues>({
      defaultValues: { phone: '' },
    });
    return (
      <PhoneContent
        control={control}
        isSubmitting={isSubmitting}
        onSubmit={jest.fn()}
        error={error}
        errorStatus={errorStatus}
      />
    );
  }

  test('renders title and subtitle', () => {
    render(<TestHarness />);

    expect(screen.getByText('Qual o seu número?')).toBeOnTheScreen();
    expect(
      screen.getByText('Enviaremos um código de verificação para este\nnúmero.'),
    ).toBeOnTheScreen();
  });

  test('renders phone input with placeholder', () => {
    render(<TestHarness />);

    expect(
      screen.getByPlaceholderText('(11) 99999-9999'),
    ).toBeOnTheScreen();
  });

  test('renders submit button', () => {
    render(<TestHarness />);

    expect(screen.getByText('Enviar')).toBeOnTheScreen();
  });

  test('disables button when isSubmitting', () => {
    render(<TestHarness isSubmitting={true} />);

    const button = screen.getByText('Enviar');
    expect(button).toBeDisabled();
  });

  test('shows error banner when error prop set', () => {
    render(
      <TestHarness error="Número inválido" errorStatus={400} />,
    );

    expect(screen.getByText('Erro ao enviar código')).toBeOnTheScreen();
    expect(screen.getByText('Número inválido')).toBeOnTheScreen();
  });

  test('does not show error banner when no error', () => {
    render(<TestHarness error={null} />);

    expect(
      screen.queryByText('Erro ao enviar código'),
    ).not.toBeOnTheScreen();
  });
});
