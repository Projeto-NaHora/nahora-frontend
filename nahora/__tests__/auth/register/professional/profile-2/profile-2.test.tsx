import React from 'react';
import { render, screen } from '@tests/test-utils';
import Profile2 from '@/app/(auth)/(register)/professional/profile-2';
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

describe('Profile2Screen', () => {
  beforeEach(() => {
    useRegisterStore.setState({
      about: '',
      especialidades: [],
    });
    jest.clearAllMocks();
  });

  test('renders profile step indicator and heading', () => {
    render(<Profile2 />);

    expect(screen.getByText('Suas Especialidades')).toBeOnTheScreen();
  });

  test('renders about text input with label', () => {
    render(<Profile2 />);

    expect(screen.getByText('Sobre Você')).toBeOnTheScreen();
    expect(
      screen.getByPlaceholderText(
        'Descreva brevemente sua experiência, certificações e o que faz seu serviço se destacar...',
      ),
    ).toBeOnTheScreen();
  });

  test('renders specialties section', () => {
    render(<Profile2 />);

    expect(screen.getByText('Especialidades')).toBeOnTheScreen();
  });

  test('renders continue and back buttons', () => {
    render(<Profile2 />);

    expect(screen.getByText('Próximo Passo')).toBeOnTheScreen();
    expect(screen.getByText('Voltar')).toBeOnTheScreen();
  });
});
