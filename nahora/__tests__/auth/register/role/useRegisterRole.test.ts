import { renderHook } from '@tests/test-utils';
import { act } from '@testing-library/react-native';
import { useRegisterRole } from '@/features/auth/hooks/useRegisterRole';
import { useRegisterStore } from '@/store/registerStore';

describe('useRegisterRole', () => {
  beforeEach(() => {
    useRegisterStore.setState({ role: null });
  });

  test('selectRole sets CLIENTE role in store', () => {
    const { result } = renderHook(() => useRegisterRole());

    act(() => {
      result.current.selectRole('CLIENTE');
    });

    expect(useRegisterStore.getState().role).toBe('CLIENTE');
  });

  test('selectRole sets PROFISSIONAL role in store', () => {
    const { result } = renderHook(() => useRegisterRole());

    act(() => {
      result.current.selectRole('PROFISSIONAL');
    });

    expect(useRegisterStore.getState().role).toBe('PROFISSIONAL');
  });
});
