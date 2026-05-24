# TDD Workflow for NaHora! Test Implementation

## Quick start

```bash
npm test                    # run all tests
npm test -- <pattern>       # run matching tests (e.g. npm test -- login)
npm run test:watch          # watch mode
```

## The 3-file pattern

Every implemented page gets a directory under `__tests__/<route-group>/<subflow>/<page>/` with:

```
__tests__/auth/register/phone/
├── phone.test.tsx           # page integration test
├── PhoneContent.test.tsx    # component unit test
└── useRegisterPhone.test.ts # hook unit test
```

Create them in this order (outside-in TDD):

### Step 1: Page test (`<page>.test.tsx`)

Renders the `app/` screen. Mock its hook and expo-router. Assert the screen renders the right component.

```tsx
import { render, screen } from '@tests/test-utils';
import Screen from '@/app/(auth)/(register)/phone';

jest.mock('@/features/auth/service', () => ({
  authService: { sendOtp: jest.fn().mockResolvedValue({}) },
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));

describe('PhoneScreen', () => {
  test('renders title and input', () => {
    render(<Screen />);
    expect(screen.getByText('Qual o seu número?')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('(11) 99999-9999')).toBeOnTheScreen();
  });
});
```

### Step 2: Component test (`<Component>.test.tsx`)

Tests the component in isolation. Use a `TestHarness` that calls `useForm` to provide a real `control` object. Test every visual state.

```tsx
import { render, screen } from '@tests/test-utils';
import { useForm } from 'react-hook-form';
import { PhoneContent } from '@/features/auth/components/PhoneContent';

jest.mock('@/hooks/use-color-scheme', () => ({ useColorScheme: () => 'light' }));
jest.mock('@/components/ui/icon-symbol', () => ({ IconSymbol: () => null }));

function TestHarness({ isSubmitting = false, error = null }) {
  const { control } = useForm({ defaultValues: { phone: '' } });
  return (
    <PhoneContent control={control} isSubmitting={isSubmitting}
      onSubmit={jest.fn()} error={error} />
  );
}

describe('PhoneContent', () => {
  test('renders title', () => {
    render(<TestHarness />);
    expect(screen.getByText('Qual o seu número?')).toBeOnTheScreen();
  });

  test('shows error banner when error prop set', () => {
    render(<TestHarness error="Número inválido" />);
    expect(screen.getByText('Erro ao enviar código')).toBeOnTheScreen();
  });

  test('disables button when submitting', () => {
    render(<TestHarness isSubmitting={true} />);
    expect(screen.getByText('Enviar')).toBeDisabled();
  });
});
```

### Step 3: Hook test (`<Hook>.test.ts`)

Uses `renderHook`. Mock the service, interact with the hook, assert service calls and state changes.

```tsx
import { renderHook, act } from '@tests/test-utils';
import { useRegisterPhone } from '@/features/auth/hooks/useRegisterPhone';
import { authService } from '@/features/auth/service';
import { useRegisterStore } from '@/store/registerStore';

jest.mock('@/features/auth/service', () => ({ authService: { sendOtp: jest.fn() } }));
jest.mock('@/utils/apiError', () => ({
  parseApiError: jest.fn((e) => ({ message: (e as Error).message, statusCode: null })),
}));

describe('useRegisterPhone', () => {
  beforeEach(() => {
    useRegisterStore.setState({ phone: '' });
    jest.clearAllMocks();
  });

  test('calls sendOtp on valid submit', async () => {
    (authService.sendOtp as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useRegisterPhone({ onSuccess: jest.fn() }));

    act(() => { result.current.form.setValue('phone', '(11) 99999-9999'); });
    await act(async () => { await result.current.onSubmit(); });

    expect(authService.sendOtp).toHaveBeenCalledWith({ telefone: '11999999999' });
  });
});
```

## Boilerplate per route group

### Auth pages

All auth screens use `AuthScreenShell` (which calls `useSafeAreaInsets` and `useColorScheme`). Always include:

```tsx
jest.mock('@/hooks/use-color-scheme', () => ({ useColorScheme: () => 'light' }));
jest.mock('@/components/ui/icon-symbol', () => ({ IconSymbol: () => null }));
```

If the screen uses `react-hook-form`'s `Controller`, create a `TestHarness` component that calls `useForm` and passes `control` down. Never call `useForm` directly inside a `test()` callback — it's a hook and React will throw "Invalid hook call."

### Client pages

Mock `useSafeAreaInsets` and the relevant SWR hook. For list screens, mock `useOrders` / `useProposals` to return `{ data: [], isLoading: false, error: undefined }`.

### Professional pages

Same as client plus `expo-image-picker` mock if the screen has camera/gallery functionality.

## What NOT to mock

- **Zustand stores**: Use `useSomeStore.setState({ ... })` in `beforeEach` to set initial state. The real store runs fine in tests.
- **react-hook-form**: Use the real `useForm`. Don't mock `Controller`. Create a `TestHarness` component that calls `useForm` and renders the component with the real `control`.
- **Zod schemas**: Let them validate normally. If a test fails with "validation," check your test values against the schema.

## Common failures and fixes

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| "Invalid hook call" | `useForm()` called inside `test()` callback, not inside a component | Wrap in `TestHarness` component |
| "Unable to find an element with text: X" | Text doesn't match what component actually renders | Read the component source, find the exact string. Use `\n` aware matching (regex if needed) |
| "Unable to find an element with role: textbox" | `TextInput` has no `aria-label` / `accessibilityLabel` | Use `screen.UNSAFE_getAllByType(TextInput)` or `getByPlaceholderText` |
| "Cannot read properties of undefined (reading 'set')" | Mock shape doesn't match real module's exports | Check the source module's actual `export` shape |
| "Found multiple elements with text: X" | `getByText` finds >1 match | Use `getAllByText` or add more context |
| Babel parse error referencing `__mocks__/` file | JSX in a `.ts` file | Replace JSX with `React.createElement()` calls |
| `useSafeAreaInsets is not a function` | Mock conflict between inline `jest.mock` and global `__mocks__/` | Remove inline mock, rely on the global one |
| SWR mutation test flakes or throws unhandled rejection | SWR's `onError` fires outside React's `act()` boundary | Test the service call, not the error state. Use `waitFor` only for `onSuccess` state |

## Adding tests for a new feature

1. Read the feature's `types.ts` to understand the data shapes
2. Read the feature's `service.ts` to know what API calls exist
3. Read the feature's hooks to understand state transitions
4. Read the feature's components to know what text/labels they render
5. Create the test directory under `__tests__/<route-group>/<subflow>/<page>/`
6. Write the page test first (red)
7. Write the component test (red)
8. Write the hook test (red)
9. Run `npm test -- <pattern>` to verify they fail for the right reasons
10. If testing existing code (green already), verify tests pass immediately

## Running specific tests

```bash
npm test -- auth/login              # all login tests
npm test -- OrderCard               # specific component
npm test -- useRegisterPhone        # specific hook
npx jest --no-cache                 # full clean run (slower, use when mocking changes)
```
