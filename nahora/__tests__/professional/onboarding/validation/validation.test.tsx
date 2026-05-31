import React from 'react';
import { render, screen } from '@tests/test-utils';
import Validation from '@/app/(onboarding)/validation';
import { useRegisterStore } from '@/store/registerStore';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

describe('OnboardingValidationScreen', () => {
  beforeEach(() => {
    useRegisterStore.setState({ profession: undefined });
    jest.clearAllMocks();
  });

  test('renders validation pending message', () => {
    render(<Validation />);

    expect(
      screen.getByText(/Validando suas/),
    ).toBeOnTheScreen();
  });

  test('renders default label when no profession set', () => {
    render(<Validation />);

    expect(screen.getByText('Em validação')).toBeOnTheScreen();
  });

  test('renders profession-specific label when set', () => {
    useRegisterStore.setState({
      profession: { id: 'eletricista', label: 'Eletricista' },
    });

    render(<Validation />);

    expect(
      screen.getByText('Eletricista · Em validação'),
    ).toBeOnTheScreen();
  });
});
