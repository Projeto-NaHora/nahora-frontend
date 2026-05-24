import { renderHook, act } from '@tests/test-utils';
import { useRegisterOtp } from '@/features/auth/hooks/useRegisterOtp';
import { useRegisterStore } from '@/store/registerStore';
import { authService } from '@/features/auth/service';
import { Alert } from 'react-native';

jest.mock('@/features/auth/service', () => ({
  authService: {
    verifyOtp: jest.fn(),
  },
}));

jest.mock('@/utils/apiError', () => ({
  parseApiError: jest.fn((error: unknown) => {
    if (error instanceof Error) {
      return { message: error.message, statusCode: null };
    }
    return { message: 'Erro desconhecido', statusCode: null };
  }),
}));

describe('useRegisterOtp', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    useRegisterStore.setState({ phone: '81912345678' });
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  test('returns phoneLabel formatted from store', () => {
    const { result } = renderHook(() =>
      useRegisterOtp({ onSuccess: mockOnSuccess }),
    );

    expect(result.current.phoneLabel).toBe('(81) 91234-5678');
  });

  test('returns phoneLabel undefined when no phone in store', () => {
    useRegisterStore.setState({ phone: '' });
    const { result } = renderHook(() =>
      useRegisterOtp({ onSuccess: mockOnSuccess }),
    );

    expect(result.current.phoneLabel).toBeUndefined();
  });

  test('shows alert when submitting incomplete code', () => {
    const { result } = renderHook(() =>
      useRegisterOtp({ onSuccess: mockOnSuccess }),
    );

    act(() => {
      result.current.onChangeCode('12');
    });

    act(() => {
      result.current.onSubmit();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Código incompleto',
      'Digite os 6 dígitos do código.',
    );
  });

  test('onChangeCode updates the code state', () => {
    const { result } = renderHook(() =>
      useRegisterOtp({ onSuccess: mockOnSuccess }),
    );

    act(() => {
      result.current.onChangeCode('123456');
    });

    expect(result.current.code).toBe('123456');
  });

  test('calls verifyOtp when code is complete and submitted', async () => {
    (authService.verifyOtp as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() =>
      useRegisterOtp({ onSuccess: mockOnSuccess }),
    );

    act(() => {
      result.current.onChangeCode('123456');
    });

    await act(async () => {
      result.current.onSubmit();
    });

    expect(authService.verifyOtp).toHaveBeenCalledWith({
      telefone: '81912345678',
      codigo: '123456',
    });
  });
});
