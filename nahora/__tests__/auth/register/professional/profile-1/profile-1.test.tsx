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
      experienceYears: '',
      profilePhotoUri: null,
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      latitude: null,
      longitude: null,
      raioAtuacaoKm: '',
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

  test('renders CEP input', () => {
    render(<Profile1 />);

    expect(screen.getByPlaceholderText('00000-000')).toBeOnTheScreen();
  });

  test('renders address fields', () => {
    render(<Profile1 />);

    expect(screen.getByPlaceholderText('Rua / Avenida')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('123')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Bairro')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Cidade')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('UF')).toBeOnTheScreen();
  });

  test('renders experiencia and raio fields', () => {
    render(<Profile1 />);

    expect(screen.getByPlaceholderText('ex. 8')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('ex. 20')).toBeOnTheScreen();
  });

  test('renders continue button', () => {
    render(<Profile1 />);

    expect(screen.getByText('Próximo Passo')).toBeOnTheScreen();
  });
});
