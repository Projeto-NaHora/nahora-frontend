import { renderHook, act } from '@tests/test-utils';
import { useRegisterEmail } from '@/features/auth/hooks/useRegisterEmail';
import { useRegisterStore } from '@/store/registerStore';

describe('useRegisterEmail', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    useRegisterStore.setState({ email: '' });
    jest.clearAllMocks();
  });

  test('initializes form with stored email', () => {
    useRegisterStore.setState({ email: 'joao@email.com' });

    const { result } = renderHook(() =>
      useRegisterEmail({ onSuccess: mockOnSuccess }),
    );

    expect(result.current.form.getValues('email')).toBe('joao@email.com');
  });

  test('saves email to store and calls onSuccess on valid submit', async () => {
    const { result } = renderHook(() =>
      useRegisterEmail({ onSuccess: mockOnSuccess }),
    );

    act(() => {
      result.current.form.setValue('email', 'maria@email.com');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(useRegisterStore.getState().email).toBe('maria@email.com');
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
