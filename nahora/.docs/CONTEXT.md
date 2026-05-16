# NaHora! — Regra Mestre para Agentes de IA

## Visão geral do projeto

O **NaHora!** é um marketplace mobile (iOS e Android) de serviços essenciais (elétrica, encanamento, pintura, pedreiro, ar-condicionado) que conecta clientes a profissionais autônomos verificados em tempo real.

O repositório contém exclusivamente o **app mobile** (React Native + Expo). O backend é externo (Spring Boot) e expõe:
- **REST API**: `EXPO_PUBLIC_API_URL` (configurado no `.env`)
- **WebSocket STOMP**: `EXPO_PUBLIC_WS_URL` (configurado no `.env`)
- **Auth**: JWT (access token 15 min em memória / Zustand) + refresh token (7 dias no expo-secure-store)

---

## Protocolo obrigatório antes de implementar qualquer tela

Antes de escrever **qualquer** código de tela, execute esta sequência sem exceção:

1. **Consulte o documento de especificação do projeto** (`Nahora_PRD.txt` ou equivalente na raiz) para entender o escopo, arquitetura e convenções vigentes.
2. **Identifique o layout** ao qual a tela pertence (`(auth)`, `(client)` ou `(professional)`) e seu código de tela (ex.: `B01`, `C04`, `G03`).
3. **Identifique a feature** de domínio correspondente em `features/` (ex.: `orders`, `proposals`, `chat`, `payments`, `profile`, `auth`, `notifications`).
4. **Verifique o que já existe** naquela feature:
   - `features/<domínio>/hooks/` — hooks SWR / mutations já implementados
   - `features/<domínio>/service.ts` — chamadas Axios já mapeadas
   - `features/<domínio>/components/` — componentes já construídos
   - `features/<domínio>/types.ts` e `features/<domínio>/enums.ts` — tipos e enums existentes
   - `components/ui/` e `components/layout/` — design system compartilhado
5. **Se os artefatos necessários não existirem**, informe o operador e implemente seguindo a ordem de baixo para cima: `types.ts → service.ts → hooks/ → components/ → tela em app/`.
6. **Se já existirem**, reutilize-os integralmente. Nunca duplique hooks, services ou componentes já presentes.

---

## Integração com Figma

- Qualquer prompt que contenha um **link de seleção do Figma** deve obrigatoriamente utilizar o servidor MCP **`figma-bridge`**, já configurado e ativo na IDE.
- Use o `figma-bridge` para inspecionar tokens de cor, espaçamento, tipografia e estrutura de componentes antes de escrever qualquer estilo ou layout.
- **Regra crítica — Tab Bar:** a grande maioria das páginas do Figma exibe uma Tab Bar no frame. Essa Tab Bar pertence ao layout de tabs de cada grupo de rota (`(client)/_layout.tsx` ou `(professional)/_layout.tsx`) e **não deve ser reimplementada dentro de nenhuma tela individual**. Ignore-a completamente ao implementar o conteúdo da tela.

---

## Stack tecnológica (não substitua sem aprovação explícita)

| Categoria | Tecnologia |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Roteamento | Expo Router v6 (file-based) |
| Linguagem | TypeScript 5.9 |
| Estado servidor | SWR |
| Estado cliente | Zustand |
| HTTP | Axios (`services/api/client.ts`) |
| WebSocket | @stomp/stompjs |
| Formulários | React Hook Form + Zod |
| Styling | Tailwind Stylesheet inline |
| Storage seguro | expo-secure-store |
| Notificações | expo-notifications (FCM) |
| Geolocalização | expo-location + react-native-maps |
| Testes | Jest 29 + jest-expo + React Native Testing Library v13 |

---

## Arquitetura em camadas

```
app/          → Telas finas (apenas roteamento + renderização)
features/     → Domínios de negócio (components, hooks, service, types)
components/   → Design system compartilhado (ui/, layout/)
services/api/ → Axios client + endpoints centralizados
store/        → Zustand (authStore, notifStore)
types/        → Enums e tipos globais espelhando o backend
constants/    → Tema (cores, tipografia, espaçamentos)
utils/        → Formatters, wrappers de storage, helpers de erro
```

### Regra de ouro — telas são finas

Arquivos em `app/` **nunca contêm lógica de negócio**. Uma tela deve:
1. Chamar um hook da `feature/` correspondente
2. Renderizar o que o hook retorna
3. Delegar ações de volta ao hook

```typescript
// ✅ Correto
export default function OrdersScreen() {
  const { data, isLoading, error } = useOrders();
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorView />;
  return <FlatList data={data} renderItem={({ item }) => <OrderCard order={item} />} />;
}

// ❌ Errado — nunca faça chamadas Axios ou useState direto na tela
export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { axios.get('/pedidos').then(r => setOrders(r.data)); }, []);
}
```

---

## Estrutura de uma feature (padrão obrigatório)

```
features/<domínio>/
├── components/       # Componentes exclusivos desta feature
├── hooks/            # Hooks SWR e mutations
├── service.ts        # Chamadas Axios usando o client centralizado
└── types.ts          # Tipos e enums do domínio
```

A ordem de implementação de baixo para cima é:
```
1. types.ts  →  2. service.ts  →  3. hooks/  →  4. components/  →  5. tela em app/
```

---

## Convenções de nomenclatura

| Artefato | Convenção | Exemplo |
|---|---|---|
| Componentes | PascalCase | `OrderCard.tsx` |
| Hooks | camelCase + prefixo `use` | `useOrders.ts` |
| Services | camelCase + sufixo `Service` | `orderService` |
| Stores Zustand | camelCase + sufixo `Store` | `authStore` |
| Cache keys | objeto constante + sufixo `Keys` | `ordersKeys` |
| Arquivos de tipo | camelCase | `types.ts`, `enums.ts` |
| Telas (`app/`) | kebab-case | `forgot-password.tsx` |

---

## Camada de API

- **Toda comunicação HTTP** passa por `services/api/client.ts` (Axios com interceptores de JWT e refresh silencioso).
- **Todos os paths** ficam em `services/api/endpoints.ts`. Nunca escreva uma URL hardcoded fora deste arquivo.
- O backend retorna erros no formato `{ status, error, message }`. Use sempre o helper abaixo:

```typescript
// utils/apiError.ts
export function getApiErrorMessage(error: unknown, fallback = 'Algo deu errado'): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}
```

---

## Grupos de rota e escopo de telas

| Grupo | Código | Descrição |
|---|---|---|
| `(auth)` | A01–A16 | Splash, login, OTP, cadastro multietapa (cliente e profissional), recuperação de senha |
| `(client)` | B01–F09 | Home, categorias, pedidos, propostas, pagamento, chat, favoritos, conta do cliente |
| `(professional)` | G01–J03 | Pedidos disponíveis, propostas, chat, perfil, ganhos, serviços em andamento, conta do profissional |

O redirecionamento pós-login ocorre em `app/_layout.tsx` com base no campo `tipo` (`CLIENTE` | `PROFISSIONAL`) retornado pelo JWT. Nunca coloque lógica de redirecionamento de papel dentro de telas individuais.

---

## Estado global (Zustand)

- `store/authStore.ts` — access token (memória), dados do usuário, `tipo` do papel
- `store/notifStore.ts` — contador de notificações não lidas

O **access token** fica apenas em memória (Zustand). O **refresh token** fica no `expo-secure-store`. Nunca inverta essa decisão.

---

## Chat em tempo real

- Utiliza `@stomp/stompjs` conectado ao endpoint `EXPO_PUBLIC_WS_URL`.
- A lógica de conexão/subscrição fica em `features/chat/stompClient.ts`.
- O canal é por **proposta** (`conversaId` vem do response de criação de proposta), não por pedido.

---

## Infraestrutura de testes

### Pilha

| Camada | Arquivo | Função |
|---|---|---|
| Config | `jest.config.js` | Preset `jest-expo`, aliases (`@/`, `@tests/`), moduleNameMapper para módulos nativos |
| Setup | `jest.setup.ts` | Bootstrap do React Native, gesture-handler, reanimated, stub do expo-modules-core |
| Mocks globais | `__mocks__/` (5 arquivos) | Substituem módulos nativos inacessíveis no Node.js |
| Utilities | `__tests__/test-utils.tsx` | `render()` customizado com provider SWR; re-exporta tudo do RNTL |
| Factories | `__tests__/factories/` | Funções geradoras de dados de teste (`createMockPedido`, `createMockUser`) |
| Documentação | `.docs/tests/` (13 arquivos) | Guia completo da API do RNTL v13 (queries, matchers, eventos, async) |

### Estrutura de diretórios

```
__tests__/
├── auth/                        # Grupo (auth) — 13 páginas implementadas
│   ├── login/                   #   index.test.tsx + LoginContent.test.tsx + useLogin.test.ts
│   └── register/
│       ├── role/                #   role.test.tsx + RoleContent.test.tsx + useRegisterRole.test.ts
│       ├── phone/               #   phone.test.tsx + PhoneContent.test.tsx + useRegisterPhone.test.ts
│       ├── otp/                 #   (idem)
│       ├── name/                #   (idem)
│       ├── email/               #   (idem)
│       ├── password/            #   (idem)
│       └── professional/        #   6 páginas (profession, docs, profile-1/2/3, validation)
├── client/                      # Grupo (client) — 2 páginas implementadas
│   └── orders/
│       ├── index/               #   index.test.tsx + 5 component tests
│       └── new/                 #   new.test.tsx
└── professional/                # Grupo (professional) — 0 páginas (todas stubs)
    └── .gitkeep
```

**Regra:** espelha a estrutura de `app/`. Cada diretório de página contém até 3 arquivos:
- `<page>.test.tsx` — teste de integração da tela (renderiza a screen, verifica wiring hook → componente)
- `<Component>.test.tsx` — teste unitário do componente (provas via props, todos os estados visuais)
- `<Hook>.test.ts` — teste unitário do hook (`renderHook`, transições de estado, chamadas ao service)

### Mocks globais (`__mocks__/`)

Aplicados via `moduleNameMapper` em `jest.config.js`. **Nunca use `jest.mock()` inline para estes módulos** — o mock global já cobre todos os testes:

| Mock | Substitui | Motivo |
|---|---|---|
| `expo-router.ts` | Roteador file-based | `useRouter`, `Stack`, `Link` dependem de primitivas nativas |
| `expo-secure-store.ts` | Keychain/Keystore | Armazenamento criptografado nativo |
| `expo-symbols.ts` | SF Symbols | Views nativas exclusivas do iOS |
| `react-native-safe-area-context.ts` | Safe area insets | Métricas nativas de tela |
| `fileMock.js` | Imagens/assets | `require('./logo.png')` retorna string |

### O que NUNCA mockar

- **Zustand stores** — Use `useStore.setState({...})` no `beforeEach`. A store real funciona no ambiente de teste.
- **react-hook-form** — Use `useForm` real. Crie um componente `TestHarness` que chama `useForm` e renderiza o componente com o `control` real.
- **Zod schemas** — Deixe validar normalmente. Se um teste falhar com erro de validação, corrija os valores de teste para atenderem o schema.
- **SWR** — O `test-utils.tsx` já provê um `SWRConfig` com cache em Map e `dedupingInterval: 0`. Nenhum mock adicional necessário para hooks `useSWR`.

### Estratégia de mock por camada de teste

| Camada | O que mockar | Exemplo |
|---|---|---|
| **Page test** | O hook que a tela chama + expo-router | `jest.mock('@/features/orders/hooks/useOrders', ...)` |
| **Component test** | `useColorScheme`, `IconSymbol` (ruído visual) | Mockar para retornar `"light"` e renderizar `null` |
| **Hook test** | O service (`authService.login`, `orderService.listar`) + `parseApiError` | `jest.mock('@/features/auth/service', ...)` |

### Comandos

```bash
npm test                        # Todos os testes
npm test -- <pattern>           # Filtro (ex: npm test -- login)
npm run test:watch              # Watch mode
npx jest --no-cache             # Limpa cache de transform (use após mudar mocks)
```

### Convenções de nomenclatura para testes

| Artefato | Convenção | Exemplo |
|---|---|---|
| Arquivo de teste | `<nome>.test.ts(x)` | `OrderCard.test.tsx` |
| Suite (`describe`) | Nome do componente/hook/tela | `describe('OrderCard', ...)` |
| Caso (`test`) | `'<verbo> <comportamento>'` | `test('renders status badge', ...)` |
| Função mock | `mock<Nome>` | `mockPush`, `mockBack` |

### Guia de troubleshooting

| Sintoma | Causa provável |
|---|---|
| "Invalid hook call" | `useForm()` chamado dentro de `test()`, não dentro de um componente |
| "Unable to find an element with text: X" | Texto esperado não confere com o que o componente renderiza — **leia o fonte do componente** |
| "Unable to find an element with role: textbox" | `TextInput` sem `aria-label` — use `UNSAFE_getAllByType(TextInput)` ou `getByPlaceholderText` |
| "Cannot read properties of undefined (reading 'set')" | Forma do mock não confere com os exports do módulo real |
| Erro de parse Babel referenciando `__mocks__/` | JSX em arquivo `.ts` — substitua por `React.createElement()` |
| SWR mutation rejeição não tratada | `onError` do SWR dispara fora do `act()` — teste a chamada ao service, não o estado de erro |

### Documentação detalhada

O guia completo de TDD com exemplos passo-a-passo está em `.docs/tests/handoff-tdd-workflow.md`.

---

## Checklist antes de submeter qualquer implementação

- [ ] A tela em `app/` está fina (sem lógica de negócio, sem chamadas Axios diretas)?
- [ ] Verifiquei hooks, services e componentes existentes na feature antes de criar novos?
- [ ] A Tab Bar do Figma foi ignorada (não reimplementada na tela)?
- [ ] Se o prompt continha link do Figma, usei o servidor MCP `figma-bridge`?
- [ ] Todos os paths de API estão em `services/api/endpoints.ts`?
- [ ] Usei `getApiErrorMessage` para tratar erros da API?
- [ ] A nomenclatura segue a tabela de convenções?
- [ ] Nenhum token, cor ou espaçamento está hardcoded fora do `constants/theme.ts`?
- [ ] Testes foram criados/atualizados em `__tests__/<grupo>/<subflow>/<pagina>/`?
- [ ] Para cada página implementada: page test + component test + hook test?
- [ ] `npm test` passa sem failures?
- [ ] Mocks inline não duplicam mocks globais do `__mocks__/`?
- [ ] Nenhum `jest.mock()` inline para `react-native-safe-area-context`, `expo-router`, `expo-secure-store`, `expo-symbols`?