import type { AuthUser } from '@/features/auth/types';

export function createMockUser(overrides?: Partial<AuthUser>): AuthUser {
  return {
    id: 1,
    nome: 'João Silva',
    tipo: 'CLIENTE',
    ...overrides,
  };
}

function createMockLoginResponse() {
  return {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    tipoUsuario: 'CLIENTE' as const,
    usuario: {
      id: 1,
      nome: 'João Silva',
      tipo: 'CLIENTE' as const,
    },
  };
}

function createMockLoginFormValues() {
  return {
    identificador: '11999999999',
    senha: '12345678',
  };
}
