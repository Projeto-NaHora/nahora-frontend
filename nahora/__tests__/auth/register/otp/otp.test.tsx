import React from 'react';
import { TextInput } from 'react-native';
import { render, screen } from '@tests/test-utils';
import { userEvent } from '@testing-library/react-native';
import Screen from '@/app/(auth)/(register)/otp';
import { useRegisterStore } from '@/store/registerStore';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

jest.mock('@/features/auth/service', () => ({
  authService: {
    verifyOtp: jest.fn().mockResolvedValue({}),
  },
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

import { Alert } from 'react-native';

describe('OtpScreen', () => {
  beforeEach(() => {
    useRegisterStore.setState({ phone: '81912345678' });
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  test('renders OTP input boxes', () => {
    render(<Screen />);

    const inputs = screen.UNSAFE_getAllByType(TextInput);
    expect(inputs).toHaveLength(6);
  });

  test('renders with phone label from register store', () => {
    render(<Screen />);

    expect(screen.getByText('Verifique seu número')).toBeOnTheScreen();
  });

  test('shows alert when submitting incomplete code', async () => {
    const user = userEvent.setup();
    render(<Screen />);

    await user.press(screen.getByText('Verificar Código'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Código incompleto',
      'Digite os 6 dígitos do código.',
    );
  });

  test('submit button shows during normal state', () => {
    render(<Screen />);

    expect(screen.getByText('Verificar Código')).toBeOnTheScreen();
  });
});
