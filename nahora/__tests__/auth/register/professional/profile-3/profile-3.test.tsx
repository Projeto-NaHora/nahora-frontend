import React from 'react';
import { render, screen } from '@tests/test-utils';
import Profile3 from '@/app/(auth)/(register)/professional/profile-3';
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

jest.mock('@/features/auth/service', () => ({
  authService: {
    registerProfessional: jest.fn(),
    uploadDocumento: jest.fn().mockResolvedValue({ url: '' }),
  },
}));

jest.mock('@/utils/storage', () => ({
  set: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/utils/jwt', () => ({
  decodeJwtPayload: jest.fn(() => ({ id: 1, nome: 'João', tipo: 'PROFISSIONAL' })),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

describe('Profile3Screen', () => {
  beforeEach(() => {
    useRegisterStore.setState({
      portfolioPhotos: [],
      profilePhotoUri: undefined,
      about: '',
      especialidades: [],
      cpf: '123.456.789-00',
      cargo: 'Eletricista',
      experienceYears: '5',
      profession: { id: 'eletricista', label: 'Eletricista' },
    });
    jest.clearAllMocks();
  });

  test('renders profile step indicator and heading', () => {
    render(<Profile3 />);

    expect(screen.getByText('Seu Portfólio')).toBeOnTheScreen();
  });

  test('renders upload prompt', () => {
    render(<Profile3 />);

    expect(
      screen.getByText('Toque para enviar fotos'),
    ).toBeOnTheScreen();
  });

  test('renders submit and back buttons', () => {
    render(<Profile3 />);

    expect(screen.getByText('Concluir Perfil')).toBeOnTheScreen();
    expect(screen.getByText('Voltar')).toBeOnTheScreen();
  });
});
