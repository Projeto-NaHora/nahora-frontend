import React from 'react';
import { render, screen } from '@tests/test-utils';
import { NameContent } from '@/features/auth/components/NameContent';
import { useForm } from 'react-hook-form';
import type { RegisterNameFormValues } from '@/features/auth/types';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

describe('NameContent', () => {
  function TestHarness({
    isSubmitting = false,
  }: { isSubmitting?: boolean } = {}) {
    const { control } = useForm<RegisterNameFormValues>({
      defaultValues: { firstName: '', lastName: '' },
    });
    return (
      <NameContent
        control={control}
        isSubmitting={isSubmitting}
        onSubmit={jest.fn()}
      />
    );
  }

  test('renders title and subtitle', () => {
    render(<TestHarness />);

    expect(screen.getByText('Qual seu nome?')).toBeOnTheScreen();
    expect(
      screen.getByText('Defina seu nome para começar a usar o NaHora!'),
    ).toBeOnTheScreen();
  });

  test('renders first name and last name inputs', () => {
    render(<TestHarness />);

    expect(screen.getByPlaceholderText('Nome')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Sobrenome')).toBeOnTheScreen();
  });

  test('renders confirm button', () => {
    render(<TestHarness />);

    expect(screen.getByText('Confirmar')).toBeOnTheScreen();
  });

  test('disables button when isSubmitting', () => {
    render(<TestHarness isSubmitting={true} />);

    expect(screen.getByText('Confirmar')).toBeDisabled();
  });
});
