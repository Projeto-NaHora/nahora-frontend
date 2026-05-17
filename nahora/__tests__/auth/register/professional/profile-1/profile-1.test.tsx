import React from 'react';
import { render, screen } from '@tests/test-utils';
import Profile1 from '@/app/(auth)/(register)/professional/profile-1';
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
  launchImageLibraryAsync: jest
    .fn()
    .mockResolvedValue({ canceled: true, assets: [] }),
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('Profile1Screen', () => {
  beforeEach(() => {
    useRegisterStore.setState({
      cpf: '',
      cargo: '',
      location: '',
      experienceYears: undefined,
      profilePhotoUri: undefined,
    });
    jest.clearAllMocks();
  });

  test('renders profile step indicator and heading', () => {
    render(<Profile1 />);

    expect(screen.getByText('Detalhes Pessoais')).toBeOnTheScreen();
    expect(screen.getByText('Info Básica')).toBeOnTheScreen();
  });

  test('renders CPF input', () => {
    render(<Profile1 />);

    expect(screen.getByPlaceholderText('ex. 999.999.999-00')).toBeOnTheScreen();
  });

  test('renders cargo input', () => {
    render(<Profile1 />);

    expect(screen.getByPlaceholderText('ex. Eletricista')).toBeOnTheScreen();
  });

  test('renders location input', () => {
    render(<Profile1 />);

    expect(
      screen.getByPlaceholderText('Cidade, Estado'),
    ).toBeOnTheScreen();
  });

  test('renders continue button', () => {
    render(<Profile1 />);

    expect(screen.getByText('Próximo Passo')).toBeOnTheScreen();
  });
});
