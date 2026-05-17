import React from 'react';
import { render, screen } from '@tests/test-utils';
import NewOrderScreen from '@/app/(client)/(orders)/new';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

jest.mock('@/features/orders/hooks/useCreateOrderForm', () => ({
  useCreateOrderForm: () => ({
    control: {} as any,
    isSubmitting: false,
    enderecoDiferente: false,
    errorMessage: null,
    errors: {},
    midiasPicker: {
      mediaUris: [],
      isUploading: false,
      uploadError: null,
      pickFromCamera: jest.fn(),
      pickFromGallery: jest.fn(),
      removeMedia: jest.fn(),
      uploadAll: jest.fn(),
    },
    onSubmit: jest.fn(),
    handleClear: jest.fn(),
  }),
}));

jest.mock('@/features/orders/components/OrderFormContent', () => ({
  OrderFormContent: () => null,
}));

const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: jest.fn() }),
}));

describe('NewOrderScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders header with title', () => {
    render(<NewOrderScreen />);

    expect(screen.getByText('Pedido')).toBeOnTheScreen();
  });
});
