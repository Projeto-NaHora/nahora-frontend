import { renderHook, act } from '@tests/test-utils';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/features/auth/service';

jest.mock('@/features/auth/service', () => ({
  authService: { login: jest.fn() },
}));

jest.mock('@/utils/apiError', () => ({
  parseApiError: jest.fn((error: unknown) => {
    if (error && typeof error === 'object' && 'message' in error) {
      return { message: String((error as Error).message), statusCode: null };
    }
    return { message: 'Erro desconhecido', statusCode: null };
  }),
}));

jest.mock('@/utils/jwt', () => ({
  decodeJwtPayload: jest.fn(() => ({ id: 1, nome: 'João', tipo: 'CLIENTE' })),
}));

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ accessToken: null, user: null });
  });

  test('returns form with default empty values', () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.form.getValues()).toEqual({
      identificador: '',
      password: '',
    });
  });

  test('isSubmitting is false initially', () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.isSubmitting).toBe(false);
  });

  test('errorMessage is null initially', () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.errorMessage).toBeNull();
  });

  test('calls authService.login on submit', async () => {
    const mockResponse = {
      accessToken: 'test-access',
      refreshToken: 'test-refresh',
      tipoUsuario: 'CLIENTE' as const,
    };
    (authService.login as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.form.setValue('identificador', 'test@test.com');
      result.current.form.setValue('password', 'password123');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(authService.login).toHaveBeenCalledWith({
      identificador: 'test@test.com',
      senha: 'password123',
    });
  });
});
