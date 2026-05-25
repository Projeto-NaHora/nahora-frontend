import React from 'react';
import { render, screen } from '@tests/test-utils';
import Profession from '@/app/(auth)/(register)/professional/profession';
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

describe('ProfessionScreen', () => {
  beforeEach(() => {
    useRegisterStore.setState({ profession: undefined });
    jest.clearAllMocks();
  });

  test('renders profession selection title', () => {
    render(<Profession />);

    expect(
      screen.getByText('Qual é a sua profissão?'),
    ).toBeOnTheScreen();
  });

  test('renders profession options', () => {
    render(<Profession />);

    expect(screen.getByText('Eletricista')).toBeOnTheScreen();
    expect(screen.getByText('Encanador')).toBeOnTheScreen();
    expect(screen.getByText('Pintor')).toBeOnTheScreen();
    expect(screen.getByText('Pedreiro / Reforma')).toBeOnTheScreen();
    expect(screen.getByText('Marcenaria')).toBeOnTheScreen();
  });

  test('renders continue button', () => {
    render(<Profession />);

    expect(screen.getByText('Continuar')).toBeOnTheScreen();
  });
});
