import React from 'react';
import { render, screen } from '@tests/test-utils';
import { userEvent } from '@testing-library/react-native';
import Screen from '@/app/(auth)/(register)/role';
import { useRegisterStore } from '@/store/registerStore';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('RoleScreen', () => {
  beforeEach(() => {
    useRegisterStore.setState({ role: null });
    mockPush.mockClear();
  });

  test('renders role selection buttons', () => {
    render(<Screen />);

    expect(screen.getByText('Profissional')).toBeOnTheScreen();
    expect(screen.getByText('Cliente')).toBeOnTheScreen();
  });

  test('navigates to phone after selecting PROFISSIONAL', async () => {
    const user = userEvent.setup();
    render(<Screen />);

    await user.press(screen.getByText('Profissional'));

    expect(useRegisterStore.getState().role).toBe('PROFISSIONAL');
    expect(mockPush).toHaveBeenCalledWith('/(auth)/(register)/phone');
  });

  test('navigates to phone after selecting CLIENTE', async () => {
    const user = userEvent.setup();
    render(<Screen />);

    await user.press(screen.getByText('Cliente'));

    expect(useRegisterStore.getState().role).toBe('CLIENTE');
    expect(mockPush).toHaveBeenCalledWith('/(auth)/(register)/phone');
  });
});
