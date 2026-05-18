import { renderHook, act } from '@tests/test-utils';
import { useRegisterPhone } from '@/features/auth/hooks/useRegisterPhone';
import { useRegisterStore } from '@/store/registerStore';
import { authService } from '@/features/auth/service';

jest.mock('@/features/auth/service', () => ({
  authService: { sendOtp: jest.fn() },
}));

jest.mock('@/utils/apiError', () => ({
  parseApiError: jest.fn((error: unknown) => {
    if (error && typeof error === 'object' && 'message' in error) {
      return { message: String((error as Error).message), statusCode: null };
    }
    return { message: 'Erro desconhecido', statusCode: null };
  }),
}));

describe('useRegisterPhone', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    useRegisterStore.setState({ phone: '' });
    jest.clearAllMocks();
  });

  test('initializes form with stored phone', () => {
    useRegisterStore.setState({ phone: '11999999999' });
    const { result } = renderHook(() =>
      useRegisterPhone({ onSuccess: mockOnSuccess }),
    );
    expect(result.current.form.getValues('phone')).toBe('11999999999');
  });

  test('calls sendOtp on valid submit', async () => {
    (authService.sendOtp as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() =>
      useRegisterPhone({ onSuccess: mockOnSuccess }),
    );

    act(() => {
      result.current.form.setValue('phone', '(11) 99999-9999');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(authService.sendOtp).toHaveBeenCalledWith({
      telefone: '11999999999',
    });
    expect(useRegisterStore.getState().phone).toBe('11999999999');
  });
});
