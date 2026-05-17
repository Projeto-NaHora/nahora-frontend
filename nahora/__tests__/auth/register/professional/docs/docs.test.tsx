import React from 'react';
import { render, screen } from '@tests/test-utils';
import Docs from '@/app/(auth)/(register)/professional/docs';
import { useRegisterStore } from '@/store/registerStore';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: 'granted' }),
  requestCameraPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest
    .fn()
    .mockResolvedValue({ canceled: true, assets: [] }),
  launchCameraAsync: jest
    .fn()
    .mockResolvedValue({ canceled: true, assets: [] }),
}));

jest.mock('@/features/auth/service', () => ({
  authService: {
    uploadDocumento: jest.fn().mockResolvedValue({ url: '' }),
  },
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('DocsScreen', () => {
  beforeEach(() => {
    useRegisterStore.setState({
      rgFrenteUri: undefined,
      rgVersoUri: undefined,
      selfieUri: undefined,
    });
    jest.clearAllMocks();
  });

  test('renders document upload title', () => {
    render(<Docs />);

    expect(
      screen.getByText(/Envie seus/),
    ).toBeOnTheScreen();
  });

  test('renders RG section header', () => {
    render(<Docs />);

    expect(
      screen.getByText('RG — Frente e Verso'),
    ).toBeOnTheScreen();
  });

  test('renders privacy notice', () => {
    render(<Docs />);

    expect(
      screen.getByText(/Seus dados são criptografados/),
    ).toBeOnTheScreen();
  });
});
