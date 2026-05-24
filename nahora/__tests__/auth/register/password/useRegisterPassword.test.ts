import { renderHook, act } from '@tests/test-utils';
import { useRegisterPassword } from '@/features/auth/hooks/useRegisterPassword';
import { useRegisterStore } from '@/store/registerStore';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/features/auth/service';
import { Alert } from 'react-native';

jest.mock('@/features/auth/service', () => ({
  authService: { registerClient: jest.fn() },
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
  decodeJwtPayload: jest.fn(() => ({ id: 1, nome: 'João Silva', tipo: 'CLIENTE' })),
}));

describe('useRegisterPassword', () => {
  const onClientSuccess = jest.fn();
  const onProfessional = jest.fn();
  const onMissingRole = jest.fn();

  beforeEach(() => {
    useRegisterStore.setState({
      role: 'CLIENTE',
      phone: '81912345678',
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@email.com',
      password: '',
    });
    useAuthStore.setState({ accessToken: null, user: null });
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  test('calls onProfessional when role is PROFISSIONAL', async () => {
    useRegisterStore.setState({ role: 'PROFISSIONAL' });

    const { result } = renderHook(() =>
      useRegisterPassword({ onClientSuccess, onProfessional, onMissingRole }),
    );

    act(() => {
      result.current.form.setValue('password', 'Senha@123');
      result.current.form.setValue('confirmPassword', 'Senha@123');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(onProfessional).toHaveBeenCalled();
    expect(authService.registerClient).not.toHaveBeenCalled();
  });

  test('shows alert when role is missing', async () => {
    useRegisterStore.setState({ role: null });

    const { result } = renderHook(() =>
      useRegisterPassword({ onClientSuccess, onProfessional, onMissingRole }),
    );

    act(() => {
      result.current.form.setValue('password', 'Senha@123');
      result.current.form.setValue('confirmPassword', 'Senha@123');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Erro',
      'Selecione seu perfil para continuar.',
    );
    expect(onMissingRole).toHaveBeenCalled();
  });

  test('registers client on successful submit', async () => {
    const mockResponse = {
      accessToken: 'test-access',
      refreshToken: 'test-refresh',
      tipoUsuario: 'CLIENTE' as const,
    };
    (authService.registerClient as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useRegisterPassword({ onClientSuccess, onProfessional, onMissingRole }),
    );

    act(() => {
      result.current.form.setValue('password', 'Senha@456');
      result.current.form.setValue('confirmPassword', 'Senha@456');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(authService.registerClient).toHaveBeenCalledWith({
      telefone: '81912345678',
      nome: 'João Silva',
      email: 'joao@email.com',
      senha: 'Senha@456',
    });
  });
});
