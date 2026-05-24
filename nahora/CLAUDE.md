# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project identity

NaHora! — marketplace mobile (iOS/Android) connecting clients to verified service professionals (electrician, plumber, painter, mason, HVAC). This repo contains the React Native + Expo app only; the backend is Spring Boot (external).

## Commands

```bash
npm start                  # Expo dev server
npm run android            # Run on Android
npm run ios                # Run on iOS
npm run lint               # ESLint (expo lint)
npm test                   # Run all tests
npm test -- <pattern>      # Filter tests (e.g. npm test -- login)
npm run test:watch         # Watch mode
npx jest --no-cache        # Clear transform cache (use after changing mocks)
```

## Tech stack (do not replace without approval)

| Layer | Technology |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Routing | Expo Router v6 (file-based) |
| Language | TypeScript 5.9 (strict) |
| Server state | SWR |
| Client state | Zustand |
| HTTP | Axios via `services/api/client.ts` |
| WebSocket | @stomp/stompjs |
| Forms | React Hook Form + Zod |
| Styling | Tailwind inline stylesheets |
| Secure storage | expo-secure-store |
| Testing | Jest 29 + jest-expo + React Native Testing Library v13 |

## Architecture: layers

```
app/          → Thin screens only (routing + render hook results)
features/     → Business logic: components/, hooks/, service.ts, types.ts
components/   → Shared design system: ui/, layout/
services/api/ → Axios client + centralized endpoint paths
store/        → Zustand stores (authStore, notifStore)
types/        → Global enums mirroring backend Java enums
constants/    → Theme tokens (colors, typography, spacing)
utils/        → Formatters, JWT helpers, API error helpers
```

**Golden rule:** files in `app/` never contain business logic, direct Axios calls, or `useState` for server data. They call hooks from `features/` and render results.

## Build order for any feature

Always bottom-up: `types.ts` → `service.ts` → `hooks/` → `components/` → screen in `app/`. Check what already exists in the feature before creating anything new. Never duplicate hooks, services, or components.

## Route groups

| Group | Prefix | Purpose |
|---|---|---|
| `(auth)` | A01–A16 | Splash, login, OTP, multi-step registration |
| `(client)` | B01–F09 | Client: home, orders, proposals, payments, chat, account |
| `(professional)` | G01–J03 | Professional: available orders, proposals, chat, earnings, account |

Post-login redirect is in `app/_layout.tsx` based on JWT `tipo` field (`CLIENTE` | `PROFISSIONAL`). Never put role-redirect logic inside individual screens.

Screen-to-feature mapping and full navigation flows are in `.docs/Nahora_PRD.txt` §5 and §7.

## API layer (mandatory patterns)

- All HTTP goes through `services/api/client.ts` (Axios instance with JWT interceptor and silent refresh).
- All endpoint paths live in `services/api/endpoints.ts`. Never hardcode a URL outside that file.
- Backend errors follow `{ status, error, message }`. Always use `getApiErrorMessage(error)` from `utils/apiError.ts`.

## Auth

- **Access token**: memory only (Zustand `authStore`), 15-min TTL.
- **Refresh token**: `expo-secure-store`, 7-day TTL.
- Interceptor in `client.ts` handles proactive refresh on expiry and reactive refresh on 401/403.

## Chat (WebSocket STOMP)

- Client in `features/chat/stompClient.ts` — connect/disconnect/subscribe centralized there.
- Channels are per **proposal** (`conversaId` from `POST /proposals` response), not per order. Never create STOMP instances outside `stompClient.ts`.

## Figma integration

When a prompt includes a Figma link, use the `figma-bridge` MCP server (already configured) to inspect colors, spacing, typography, and component structure before writing styles.

**Critical — Tab Bar:** Most Figma frames include a Tab Bar. It belongs to the group layout (`(client)/_layout.tsx` or `(professional)/_layout.tsx`). Never reimplement it inside individual screens.

## Testing

### Structure

Tests mirror `app/` under `__tests__/`. Each page gets up to 3 files, built outside-in:
1. `<page>.test.tsx` — integration test (mock the hook, verify hook → component wiring)
2. `<Component>.test.tsx` — unit test (render via props, all visual states)
3. `<Hook>.test.ts` — unit test (`renderHook`, mock the service, verify state transitions)

### Global mocks (`__mocks__/`)

Applied via `moduleNameMapper` in `jest.config.js`. Never use inline `jest.mock()` for these:
- `expo-router`, `expo-secure-store`, `expo-symbols`, `react-native-safe-area-context`, `fileMock.js`

### What to never mock

- **Zustand stores** — use `useStore.setState({...})` in `beforeEach`
- **react-hook-form** — use real `useForm` inside a `TestHarness` component
- **Zod schemas** — let them validate; fix test values if they fail
- **SWR** — `test-utils.tsx` provides SWRConfig with Map cache and `dedupingInterval: 0`

### Test utilities

- `__tests__/test-utils.tsx` — custom `render()` with SWR provider, re-exports everything from RNTL
- `__tests__/factories/` — test data generators

### Auth page boilerplate

All auth screens use `AuthScreenShell`. Always include:
```typescript
jest.mock('@/hooks/use-color-scheme', () => ({ useColorScheme: () => 'light' }));
jest.mock('@/components/ui/icon-symbol', () => ({ IconSymbol: () => null }));
```

Full testing guide, troubleshooting table, and TDD workflow are in `.docs/tests/`.

## Naming conventions

| Artifact | Convention | Example |
|---|---|---|
| Components | PascalCase | `OrderCard.tsx` |
| Hooks | camelCase + `use` prefix | `useOrders.ts` |
| Services | camelCase + `Service` suffix | `orderService` |
| Zustand stores | camelCase + `Store` suffix | `authStore` |
| SWR cache keys | const object + `Keys` suffix | `ordersKeys` |
| Screens (`app/`) | kebab-case | `forgot-password.tsx` |
| Test files | `<name>.test.ts(x)` | `OrderCard.test.tsx` |

## Pre-submit checklist

- Screen in `app/` is thin (no business logic, no direct Axios calls)
- Existing hooks/services/components checked before creating new ones
- Tab Bar from Figma was ignored (not reimplemented in the screen)
- Figma MCP used if the prompt contained a Figma link
- All API paths are in `services/api/endpoints.ts`
- `getApiErrorMessage` used for API errors
- Naming follows conventions table
- No hardcoded tokens/colors/spacing outside `constants/theme.ts`
- Tests created/updated per the 3-file pattern
- `npm test` passes
- No inline mocks duplicate global `__mocks__/` mocks

## Reference documents

- `.docs/CONTEXT.md` — full agent rules, architecture, test infrastructure
- `.docs/Nahora_PRD.txt` — complete PRD with screen codes, navigation flows, feature mapping
- `.docs/tests/` — detailed RNTL v13 guide and TDD workflow
