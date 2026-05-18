import React from 'react';
import { TextInput } from 'react-native';
import { render, screen } from '@tests/test-utils';
import { userEvent } from '@testing-library/react-native';
import { OtpContent } from '@/features/auth/components/OtpContent';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

describe('OtpContent', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    code: '',
    onChangeCode: jest.fn(),
    isSubmitting: false,
  };

  test('renders 6 OTP input boxes', () => {
    render(<OtpContent {...defaultProps} />);

    const inputs = screen.UNSAFE_getAllByType(TextInput);
    expect(inputs).toHaveLength(6);
  });

  test('renders title and subtitle with phone label', () => {
    render(
      <OtpContent
        {...defaultProps}
        phoneLabel="(81) 91234-5678"
      />,
    );

    expect(screen.getByText('Verifique seu número')).toBeOnTheScreen();
    expect(
      screen.getByText(
        'Enviamos um código de 6 dígitos para\n(81) 91234-5678',
      ),
    ).toBeOnTheScreen();
  });

  test('shows default subtitle when phoneLabel not provided', () => {
    render(<OtpContent {...defaultProps} />);

    expect(
      screen.getByText(
        'Enviamos um código de 6 dígitos para\n+55 81 1234-5678',
      ),
    ).toBeOnTheScreen();
  });

  test('calls onChangeCode when digit is typed', async () => {
    const user = userEvent.setup();
    const onChangeCode = jest.fn();
    render(
      <OtpContent
        {...defaultProps}
        code=""
        onChangeCode={onChangeCode}
      />,
    );

    const inputs = screen.UNSAFE_getAllByType(TextInput);
    const { fireEvent } = require('@testing-library/react-native');
    fireEvent.changeText(inputs[0], '5');

    expect(onChangeCode).toHaveBeenCalledWith('5');
  });

  test('shows submit button text as "Verificando..." when submitting', () => {
    render(<OtpContent {...defaultProps} isSubmitting={true} />);

    expect(screen.getByText('Verificando...')).toBeOnTheScreen();
  });

  test('shows submit button text as "Verificar Código" when not submitting', () => {
    render(<OtpContent {...defaultProps} isSubmitting={false} />);

    expect(screen.getByText('Verificar Código')).toBeOnTheScreen();
  });

  test('calls onSubmit when button pressed', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<OtpContent {...defaultProps} onSubmit={onSubmit} />);

    await user.press(screen.getByText('Verificar Código'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('disables submit button when isSubmitting', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <OtpContent
        {...defaultProps}
        isSubmitting={true}
        onSubmit={onSubmit}
      />,
    );

    await user.press(screen.getByText('Verificando...'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('shows error banner when error prop is set', () => {
    render(
      <OtpContent {...defaultProps} error="Código inválido" errorStatus={400} />,
    );

    expect(screen.getByText('Erro ao verificar código')).toBeOnTheScreen();
    expect(screen.getByText('Código inválido')).toBeOnTheScreen();
  });

  test('does not show error banner when no error', () => {
    render(<OtpContent {...defaultProps} error={undefined} />);

    expect(
      screen.queryByText('Erro ao verificar código'),
    ).not.toBeOnTheScreen();
  });
});
