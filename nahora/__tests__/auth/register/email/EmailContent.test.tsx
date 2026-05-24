import React from 'react';
import { render, screen } from '@tests/test-utils';
import { EmailContent } from '@/features/auth/components/EmailContent';
import { useForm } from 'react-hook-form';
import type { RegisterEmailFormValues } from '@/features/auth/types';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

describe('EmailContent', () => {
  function TestHarness({
    isSubmitting = false,
  }: { isSubmitting?: boolean } = {}) {
    const { control } = useForm<RegisterEmailFormValues>({
      defaultValues: { email: '' },
    });
    return (
      <EmailContent
        control={control}
        isSubmitting={isSubmitting}
        onSubmit={jest.fn()}
      />
    );
  }

  test('renders title', () => {
    render(<TestHarness />);

    expect(screen.getByText('Qual o seu e-mail?')).toBeOnTheScreen();
  });

  test('renders email input with placeholder', () => {
    render(<TestHarness />);

    expect(
      screen.getByPlaceholderText('email@exemplo.com'),
    ).toBeOnTheScreen();
  });

  test('renders submit button', () => {
    render(<TestHarness />);

    expect(screen.getByText('Continuar')).toBeOnTheScreen();
  });

  test('disables button when isSubmitting', () => {
    render(<TestHarness isSubmitting={true} />);

    expect(screen.getByText('Continuar')).toBeDisabled();
  });
});
