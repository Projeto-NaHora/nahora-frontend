import { renderHook, act } from '@tests/test-utils';
import { useRegisterName } from '@/features/auth/hooks/useRegisterName';
import { useRegisterStore } from '@/store/registerStore';

describe('useRegisterName', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    useRegisterStore.setState({ firstName: '', lastName: '' });
    jest.clearAllMocks();
  });

  test('initializes form with stored names', () => {
    useRegisterStore.setState({ firstName: 'João', lastName: 'Silva' });

    const { result } = renderHook(() =>
      useRegisterName({ onSuccess: mockOnSuccess }),
    );

    expect(result.current.form.getValues()).toEqual({
      firstName: 'João',
      lastName: 'Silva',
    });
  });

  test('saves name to store and calls onSuccess', async () => {
    const { result } = renderHook(() =>
      useRegisterName({ onSuccess: mockOnSuccess }),
    );

    act(() => {
      result.current.form.setValue('firstName', 'Maria');
      result.current.form.setValue('lastName', 'Santos');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(useRegisterStore.getState().firstName).toBe('Maria');
    expect(useRegisterStore.getState().lastName).toBe('Santos');
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
