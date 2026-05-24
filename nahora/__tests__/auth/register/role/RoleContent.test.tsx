import React from 'react';
import { render, screen } from '@tests/test-utils';
import { userEvent } from '@testing-library/react-native';
import { RoleContent } from '@/features/auth/components/RoleContent';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

describe('RoleContent', () => {
  test('renders title and two role buttons', () => {
    render(
      <RoleContent
        onSelectProfessional={jest.fn()}
        onSelectClient={jest.fn()}
      />,
    );

    expect(screen.getByText('Escolha seu perfil')).toBeOnTheScreen();
    expect(
      screen.getByText('Como você pretende atuar no NaHora!?'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Profissional')).toBeOnTheScreen();
    expect(screen.getByText('Cliente')).toBeOnTheScreen();
  });

  test('calls onSelectProfessional when professional button pressed', async () => {
    const user = userEvent.setup();
    const onSelectProfessional = jest.fn();
    render(
      <RoleContent
        onSelectProfessional={onSelectProfessional}
        onSelectClient={jest.fn()}
      />,
    );

    await user.press(screen.getByText('Profissional'));
    expect(onSelectProfessional).toHaveBeenCalledTimes(1);
  });

  test('calls onSelectClient when client button pressed', async () => {
    const user = userEvent.setup();
    const onSelectClient = jest.fn();
    render(
      <RoleContent
        onSelectProfessional={jest.fn()}
        onSelectClient={onSelectClient}
      />,
    );

    await user.press(screen.getByText('Cliente'));
    expect(onSelectClient).toHaveBeenCalledTimes(1);
  });
});
