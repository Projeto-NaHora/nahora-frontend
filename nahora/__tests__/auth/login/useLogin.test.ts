import { renderHook, act } from '@tests/test-utils';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/features/auth/service';

jest.mock('@/features/auth/service', () => ({
  authService: {
    login: jest.fn(),
    buscarStatusVerificacao: jest.fn(),
  },
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
  decodeJwtPayload: jest.fn(() => ({ id: 1, nome: 'João', tipo: 'PROFISSIONAL' })),
}));

const mockLoginResponse = {
  accessToken: 'test-access',
  refreshToken: 'test-refresh',
  tipoUsuario: 'PROFISSIONAL',
};

const setupLoginMocks = (status: string) => {
  (authService.login as jest.Mock).mockResolvedValue(mockLoginResponse);
  (authService.buscarStatusVerificacao as jest.Mock).mockResolvedValue(status);
};

const fillAndSubmit = async (result: ReturnType<typeof renderHook>['result']) => {
  act(() => {
    result.current.form.setValue('identificador', 'test@test.com');
    result.current.form.setValue('password', 'password123');
  });

  await act(async () => {
    await result.current.onSubmit();
  });
};

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      accessToken: null,
      user: null,
      professionalOnboarding: null,
    });
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

  test('calls authService.login on submit', async () => {
    setupLoginMocks('VERIFICADO');
    const { result } = renderHook(() => useLogin());
    await fillAndSubmit(result);

    expect(authService.login).toHaveBeenCalledWith({
      identificador: 'test@test.com',
      senha: 'password123',
    });
  });

  test('calls buscarStatusVerificacao after successful login', async () => {
    setupLoginMocks('VERIFICADO');
    const { result } = renderHook(() => useLogin());
    await fillAndSubmit(result);

    expect(authService.buscarStatusVerificacao).toHaveBeenCalledTimes(1);
  });

  test('sets isSubmitting back to false after completion', async () => {
    setupLoginMocks('VERIFICADO');
    const { result } = renderHook(() => useLogin());
    await fillAndSubmit(result);

    expect(result.current.isSubmitting).toBe(false);
  });

  describe('status → onboarding phase mapping', () => {
    test('CADASTRO_INCOMPLETO → cadastro_incompleto', async () => {
      setupLoginMocks('CADASTRO_INCOMPLETO');
      const { result } = renderHook(() => useLogin());
      await fillAndSubmit(result);
      expect(useAuthStore.getState().professionalOnboarding).toBe('cadastro_incompleto');
    });

    test('AGUARDANDO_VERIFICACAO → aguardando', async () => {
      setupLoginMocks('AGUARDANDO_VERIFICACAO');
      const { result } = renderHook(() => useLogin());
      await fillAndSubmit(result);
      expect(useAuthStore.getState().professionalOnboarding).toBe('aguardando');
    });

    test('VERIFICADO → perfil', async () => {
      setupLoginMocks('VERIFICADO');
      const { result } = renderHook(() => useLogin());
      await fillAndSubmit(result);
      expect(useAuthStore.getState().professionalOnboarding).toBe('perfil');
    });

    test('REJEITADO → rejeitado', async () => {
      setupLoginMocks('REJEITADO');
      const { result } = renderHook(() => useLogin());
      await fillAndSubmit(result);
      expect(useAuthStore.getState().professionalOnboarding).toBe('rejeitado');
    });
  });

  test('sets error message when login fails', async () => {
    (authService.login as jest.Mock).mockRejectedValue(new Error('Credenciais inválidas'));

    const { result } = renderHook(() => useLogin());
    await fillAndSubmit(result);

    expect(result.current.errorMessage).toBeTruthy();
    expect(result.current.isSubmitting).toBe(false);
  });

  test('sets error message when profile fetch fails', async () => {
    (authService.login as jest.Mock).mockResolvedValue(mockLoginResponse);
    (authService.buscarStatusVerificacao as jest.Mock).mockRejectedValue(
      new Error('Erro de rede'),
    );

    const { result } = renderHook(() => useLogin());
    await fillAndSubmit(result);

    expect(result.current.errorMessage).toBeTruthy();
    expect(result.current.isSubmitting).toBe(false);
  });
});
