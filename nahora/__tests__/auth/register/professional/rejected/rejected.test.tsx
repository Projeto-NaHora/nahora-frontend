import React from 'react';
import { Alert } from 'react-native';
import { render } from '@testing-library/react-native';
import Rejected from '@/app/(auth)/(register)/professional/rejected';
import { useAuthStore } from '@/store/authStore';
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

describe('RejectedScreen', () => {
  let alertSpy: jest.SpyInstance;
  let alertCallback: Record<string, () => void>;

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      accessToken: 'tk',
      user: { id: 1, nome: 'João', tipo: 'PROFISSIONAL' },
    });

    // Pre-populate document URIs so we can verify they get cleared
    useRegisterStore.setState({
      rgFrontUri: 'uri-front',
      rgBackUri: 'uri-back',
      selfieUri: 'uri-selfie',
      rgFrontUrl: 'url-front',
      rgBackUrl: 'url-back',
      selfieUrl: 'url-selfie',
    });

    alertCallback = {};
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(
      (_title, _message, buttons) => {
        if (buttons) {
          for (const btn of buttons) {
            if (btn.text && btn.onPress) {
              alertCallback[btn.text] = btn.onPress;
            }
          }
        }
      },
    );
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  test('renders nothing visible', () => {
    const { toJSON } = render(<Rejected />);
    expect(toJSON()).toBeNull();
  });

  test('shows alert with title about rejected documents', () => {
    render(<Rejected />);
    expect(alertSpy).toHaveBeenCalledWith(
      'Documentos rejeitados',
      expect.stringContaining('rejeitados'),
      expect.arrayContaining([
        expect.objectContaining({ text: 'Sim' }),
        expect.objectContaining({ text: 'Não' }),
      ]),
    );
  });

  test('navigates to docs and clears registerStore on "Sim"', () => {
    render(<Rejected />);

    // Simulate "Sim" button press — this triggers the onPress which calls
    // the actual Zustand setters (setRgFrontUri(null), etc.) and router.replace
    alertCallback['Sim']?.();

    // Verify the store's document fields were cleared
    const state = useRegisterStore.getState();
    expect(state.rgFrontUri).toBeNull();
    expect(state.rgBackUri).toBeNull();
    expect(state.selfieUri).toBeNull();
    expect(state.rgFrontUrl).toBeNull();
    expect(state.rgBackUrl).toBeNull();
    expect(state.selfieUrl).toBeNull();

    expect(mockReplace).toHaveBeenCalledWith(
      '/(auth)/(register)/professional/docs',
    );
  });

  test('calls logout on "Não"', () => {
    const logoutSpy = jest.fn();

    // Replace the actual logout with a spy
    jest.spyOn(useAuthStore.getState(), 'logout').mockImplementation(logoutSpy);

    render(<Rejected />);

    // Simulate "Não" button press
    alertCallback['Não']?.();

    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });
});
