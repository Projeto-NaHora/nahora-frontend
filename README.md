<div align="center">

# NaHora! — Frontend

**App mobile do marketplace que conecta clientes a profissionais autônomos em tempo real.**

[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Acadêmico-lightgrey?style=flat-square)](#-licença)

</div>

---

## 📖 Sobre o projeto

O **NaHora!** é um marketplace de serviços essenciais (elétrica, encanamento, pintura, pedreiro, ar-condicionado) que conecta clientes a profissionais autônomos verificados em tempo real.

Este repositório contém o **app mobile** (iOS e Android). O backend em Spring Boot fica em [`nahora-backend`](https://github.com/nahora/nahora-backend) e expõe:

- **REST API** em `http://localhost:8080/api/v1/`
- **WebSocket STOMP** para chat em tempo real
- **JWT** com access token de 15 min e refresh token de 7 dias (Redis)

---

## ✨ Funcionalidades

- 🔐 Cadastro com verificação de telefone por OTP, login por e-mail ou telefone
- 📋 Criação e acompanhamento de pedidos de serviço (máx. 3 pedidos abertos simultâneos)
- 📝 Envio e avaliação de propostas com agenda de horários
- 💬 Chat em tempo real vinculado a cada proposta (WebSocket STOMP)
- 💳 Pagamento via Pix (QR Code) ou cartão de crédito, com escrow via Pagar.me
- ⭐ Avaliação bilateral após conclusão do serviço
- 🔔 Notificações push via Firebase Cloud Messaging
- 🛡️ Sistema de disputa e moderação de problemas no serviço
- 📍 Busca de profissionais por categoria e raio geográfico

---

## 🛠️ Stack

| Categoria | Tecnologia | Por quê |
|---|---|---|
| **Framework** | React Native 0.81 + Expo SDK 54 | Suporte iOS/Android unificado com acesso a APIs nativas |
| **Roteamento** | Expo Router v6 (file-based) | Grupos de rota isolam os dois papéis (cliente/profissional) sem lógica condicional espalhada |
| **Linguagem** | TypeScript 5.9 | Tipos espelham os enums e DTOs do backend Java, eliminando erros de contrato |
| **Estado servidor** | SWR | Cache automático, revalidação, mutations otimistas — sem re-fetch desnecessário |
| **Estado cliente** | Zustand | Leve, sem boilerplate; guarda apenas token JWT, papel do usuário e notificações não lidas |
| **HTTP** | Axios | Interceptores para injeção de JWT e refresh silencioso do access token |
| **WebSocket** | @stomp/stompjs | Protocolo STOMP que o backend Spring usa; suporte nativo a WebSocket do React Native |
| **Formulários** | React Hook Form + Zod | RHF evita re-render por tecla; Zod espelha as validações `@Valid` do backend |
| **Styling** | NativeWind (Tailwind para RN) | Tema centralizado; sem `StyleSheet` espalhado por arquivo |
| **Storage seguro** | expo-secure-store | Tokens JWT guardados no Keychain (iOS) / Keystore (Android) |
| **Notificações push** | expo-notifications | Integração com FCM que o backend já usa |
| **Geolocalização** | expo-location + react-native-maps | Necessário para busca por raio e exibição do endereço do serviço |

---

## 📋 Pré-requisitos

Antes de começar, garanta que você tem instalado:

- **Node.js 20+** — `node -v`
- **npm 10+** — `npm -v`
- **Expo CLI** — `npx expo --version`
- **Android Studio** (para emulador Android) ou **Xcode** (para simulador iOS)
- **Backend NaHora! rodando** — ver [nahora-backend](https://github.com/nahora/nahora-backend)

---

## 🚀 Começando

### 1. Clone o repositório

```bash
git clone https://github.com/nahora/nahora-frontend.git
```

> ⚠️ **Importante:** o app vive dentro da subpasta `nahora/`. Todos os comandos a seguir devem ser executados dentro dela.

```bash
cd nahora-frontend/nahora
```

### 2. Configure o emulador Android

Siga o guia oficial do Expo para configurar o Android Studio e criar um emulador:

🔗 **https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=development-build**

Siga todos os passos até chegar em **"Create a development build"** — a partir dali, ignore o restante do guia. Rode o emulador pelo menos uma vez para garantir que está funcionando antes de continuar.

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` conforme a seção [Variáveis de ambiente](#-variáveis-de-ambiente).

### 5. Suba o backend

O backend precisa estar rodando antes de iniciar o app. Siga o README do [`nahora-backend`](https://github.com/nahora/nahora-backend):

```bash
# No repositório do backend:
docker compose up -d   # PostgreSQL + Redis
./mvnw spring-boot:run # API na porta 8080
```

### 6. Inicie o app

```bash
npx expo run:android
```

> **Por que `run:android` e não `expo start`?** O projeto usa módulos nativos (`expo-secure-store`, `expo-notifications`, `react-native-maps`) que não funcionam no Expo Go. O `run:android` compila um development build completo e instala no emulador.

---

## 🔧 Variáveis de ambiente

Crie o arquivo `.env` na raiz de `nahora/` com as seguintes variáveis:

```env
# ── API REST ──────────────────────────────────────────────────────────
# URL base da API. Em desenvolvimento, use o IP da máquina (não localhost)
# pois o app roda no dispositivo/emulador, não no host diretamente.
EXPO_PUBLIC_API_URL=http://192.168.x.x:8080/api/v1

# ── WebSocket ────────────────────────────────────────────────────────
# Endpoint STOMP do backend (sem /api/v1)
EXPO_PUBLIC_WS_URL=ws://192.168.x.x:8080/ws

# ── Firebase (Notificações Push) ─────────────────────────────────────
# Obtido no console Firebase → Configurações do projeto
EXPO_PUBLIC_FIREBASE_PROJECT_ID=nahora-app
```

> **Atenção:** Não use `localhost` no `EXPO_PUBLIC_API_URL` ao rodar no dispositivo ou emulador Android. Use o IP local da sua máquina (`ipconfig` / `ifconfig`).

---

## 📂 Estrutura do projeto

```
nahora/
│
├── app/                        # Expo Router — apenas roteamento, telas finas
│   ├── _layout.tsx             # Root layout: providers globais + redirect por papel
│   ├── (auth)/                 # Onboarding e autenticação
│   │   ├── _layout.tsx
│   │   └── ...                 # login, otp, cadastro, recuperação de senha
│   ├── (client)/               # Área do cliente
│   │   ├── _layout.tsx         # Tab bar: Início, Pedidos, Chat, Favoritos, Conta
│   │   └── ...                 # home, pedidos, propostas, pagamento, chat
│   └── (professional)/         # Área do profissional
│       ├── _layout.tsx         # Tab bar: Início, Pedidos, Chat, Serviços, Conta
│       └── ...                 # home, pedidos disponíveis, propostas, ganhos
│
├── features/                   # Lógica de negócio por domínio
│   ├── auth/                   # OTP, login, cadastro, tokens
│   ├── orders/                 # Pedidos + máquina de estados
│   ├── proposals/              # Propostas + aceite
│   ├── chat/                   # WebSocket STOMP + histórico
│   ├── payments/               # Pix, cartão, escrow
│   ├── profile/                # Perfil cliente e profissional
│   └── notifications/          # Push (FCM) + in-app
│
├── components/                 # Design system compartilhado
│   ├── ui/                     # Button, Input, Card, Avatar, Badge, Skeleton
│   └── layout/                 # SafeView, KeyboardView
│
├── services/
│   └── api/
│       ├── client.ts           # Axios + interceptores JWT e refresh
│       └── endpoints.ts        # Todos os paths da API em um só lugar
│
├── store/
│   ├── authStore.ts            # Zustand: token, user, tipo (CLIENTE | PROFISSIONAL)
│   └── notifStore.ts           # Zustand: contador de notificações não lidas
│
├── types/
│   ├── enums.ts                # Espelha todos os enums do backend Java
│   └── api.ts                  # ApiError, PaginatedResponse, etc.
│
├── constants/
│   └── theme.ts                # Cores, tipografia, espaçamentos
│
├── utils/
│   ├── formatters.ts           # Moeda, data/hora, telefone
│   └── storage.ts              # Wrappers do expo-secure-store
│
├── app.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── .env.example
```

> Cada feature segue a mesma estrutura interna: `components/`, `hooks/`, `service.ts` e `types.ts`. As telas em `app/` são finas — só consomem hooks da feature correspondente e renderizam o resultado.

---

## 🏗️ Arquitetura

### Visão em camadas

```
┌────────────────────────────────────────────────────────┐
│  app/ — Expo Router                                    │
│  Telas finas: recebe dados de hooks, renderiza UI      │
├────────────────────────────────────────────────────────┤
│  features/ — Domínios de negócio                       │
│  Cada feature: components, hooks, service, types       │
├───────────────────────┬────────────────────────────────┤
│  SWR                   │  Zustand                      │
│  Estado do servidor    │  Estado de UI (auth, notifs)  │
├───────────────────────┴────────────────────────────────┤
│  services/api/client.ts — Axios + interceptores JWT    │
│  features/chat/stompClient.ts — WebSocket STOMP        │
├────────────────────────────────────────────────────────┤
│  NaHora! Backend — REST + WebSocket                    │
└────────────────────────────────────────────────────────┘
```

### Por que feature-first e não layer-first?

O projeto tem 82 telas, 2 papéis de usuário e 8 domínios independentes (auth, pedidos, propostas, chat, pagamentos, perfil, notificações, moderação). Uma estrutura `screens/ + services/ + hooks/` no topo criaria um monólito em que todo o time edita os mesmos diretórios. Com `features/`, cada domínio é autônomo — o time de pedidos não toca nos arquivos de chat.

---

## 🔀 Navegação

O Expo Router usa grupos de rota para isolar os dois papéis. O redirecionamento pós-login acontece no `_layout.tsx` raiz baseado no campo `tipo` retornado pelo JWT:

```typescript
// app/_layout.tsx
const { user } = useAuthStore();

if (!user) return <Redirect href="/(auth)" />;
if (user.tipo === 'CLIENTE') return <Redirect href="/(client)" />;
return <Redirect href="/(professional)" />;
```

Cada grupo tem sua própria Tab Bar com ícones e rotas específicas, sem nenhum condicional espalhado nas telas.

### Grupos de rota e telas cobertas

| Grupo | Telas | Descrição |
|---|---|---|
| `(auth)` | A01–A16 | Splash, login, cadastro multietapa (cliente e profissional), OTP, recuperação de senha |
| `(client)` | B01–F09 | Home, categorias, pedidos, propostas, pagamento, chat, favoritos, conta |
| `(professional)` | G01–J03 | Pedidos disponíveis, propostas, chat, perfil, ganhos, impulsionamento |

---

## 📡 Camada de API

### Cliente Axios com interceptores

O arquivo `services/api/client.ts` centraliza toda comunicação HTTP. O interceptor de request injeta o JWT automaticamente. O interceptor de response detecta 401 e tenta o refresh silencioso antes de propagar o erro.

```typescript
// services/api/client.ts
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { useAuthStore } from '@/store/authStore';
import { storage } from '@/utils/storage';

export const api = axios.create({ baseURL: API_URL });

// Injeta o access token em cada requisição
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Tenta refresh silencioso quando recebe 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await storage.get('refreshToken');
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
```

> **Por que isso é necessário?** O backend emite access tokens com TTL de 15 minutos (`JWT_EXPIRATION_MS=900000`). Sem o interceptor de refresh, o app forçaria o usuário a fazer login novamente a cada 15 minutos.

### Endpoints da API

```typescript
// services/api/endpoints.ts
export const ENDPOINTS = {
  // Auth (público — sem JWT)
  SEND_OTP:              '/auth/send-otp',
  VERIFY_OTP:            '/auth/verify-otp',
  REGISTER_CLIENTE:      '/auth/register/cliente',
  REGISTER_PROFISSIONAL: '/auth/register/profissional',
  LOGIN:                 '/auth/login',
  FORGOT_PASSWORD:       '/auth/forgot-password',
  RESET_PASSWORD:        '/auth/reset-password',
  REFRESH_TOKEN:         '/auth/refresh',

  // Pedidos (requer JWT)
  PEDIDOS:               '/pedidos',
  PEDIDO:                (id: number) => `/pedidos/${id}`,

  // Propostas
  PROPOSTAS:             (pedidoId: number) => `/pedidos/${pedidoId}/propostas`,
  PROPOSTA:              (id: number) => `/propostas/${id}`,
  ACEITAR_PROPOSTA:      (id: number) => `/propostas/${id}/aceitar`,
  RECUSAR_PROPOSTA:      (id: number) => `/propostas/${id}/recusar`,

  // Chat (histórico REST — mensagens em tempo real via WebSocket)
  CONVERSA:              (id: number) => `/conversas/${id}`,
  MENSAGENS:             (conversaId: number) => `/conversas/${conversaId}/mensagens`,

  // Pagamentos
  PAGAMENTO:             (propostaId: number) => `/propostas/${propostaId}/pagamento`,
  CONFIRMAR_CONCLUSAO:   (pedidoId: number) => `/pedidos/${pedidoId}/confirmar`,

  // Avaliações
  AVALIAR:               (pedidoId: number) => `/pedidos/${pedidoId}/avaliacoes`,

  // Notificações
  NOTIFICACOES:          '/notificacoes',
  MARCAR_LIDA:           (id: number) => `/notificacoes/${id}/lida`,

  // Perfil
  PERFIL_CLIENTE:        '/clientes/me',
  PERFIL_PROFISSIONAL:   '/profissionais/me',
  PROFISSIONAL:          (id: number) => `/profissionais/${id}`,
  PROFISSIONAIS:         '/profissionais',
} as const;
```

---

## 💬 Chat em tempo real (WebSocket STOMP)

O backend expõe um endpoint WebSocket em `/ws` com protocolo STOMP. Cada conversa tem um canal exclusivo.

### Ciclo de vida do cliente

```typescript
// features/chat/stompClient.ts
import { Client } from '@stomp/stompjs';
import { WS_URL } from '@/constants/config';
import { useAuthStore } from '@/store/authStore';

let client: Client | null = null;

export function getStompClient(): Client {
  if (client?.active) return client;

  client = new Client({
    brokerURL: WS_URL,
    connectHeaders: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    },
    reconnectDelay: 5000,
    onDisconnect: () => console.log('[WS] Desconectado'),
  });

  client.activate();
  return client;
}

export function disconnectStomp() {
  client?.deactivate();
  client = null;
}
```

### Hook de chat por conversa

```typescript
// features/chat/hooks/useChat.ts
import { useEffect, useRef, useState } from 'react';
import { getStompClient } from '../stompClient';
import type { Mensagem } from '../types';

export function useChat(conversaId: number, historicoInicial: Mensagem[]) {
  const [mensagens, setMensagens] = useState<Mensagem[]>(historicoInicial);
  const subRef = useRef<ReturnType<typeof stomp.subscribe> | null>(null);

  useEffect(() => {
    const stomp = getStompClient();

    // Aguarda conexão antes de assinar
    stomp.onConnect = () => {
      subRef.current = stomp.subscribe(
        `/topic/chat/${conversaId}`,
        (frame) => {
          const nova: Mensagem = JSON.parse(frame.body);
          setMensagens((prev) => [...prev, nova]);
        }
      );
    };

    return () => {
      subRef.current?.unsubscribe();
    };
  }, [conversaId]);

  function enviarMensagem(conteudo: string) {
    getStompClient().publish({
      destination: `/app/chat/${conversaId}`,
      body: JSON.stringify({ conteudo }),
    });
  }

  return { mensagens, enviarMensagem };
}
```

> **Tópico por proposta, não por pedido.** O backend cria uma conversa para cada proposta enviada, não uma por pedido. O `conversaId` vem do response de criação de proposta.

---

## 🔐 Fluxo de autenticação

O backend exige uma sequência exata: OTP → verificação → cadastro. O app deve seguir esse fluxo na navegação.

```
A05 (escolha de perfil)
     ↓
A06 (telefone) → POST /auth/send-otp
     ↓
A07 (OTP 6 dígitos) → POST /auth/verify-otp
     │ redis: phone_verified:{telefone} = true (TTL 30 min)
     ↓
     ├── CLIENTE → A06–A10 → POST /auth/register/cliente → token JWT → (client)/
     └── PROFISSIONAL → A06–A10 + A11–A16 → POST /auth/register/profissional → token JWT → (professional)/
```

**Regras de OTP que o app deve respeitar:**

| Situação | Comportamento esperado |
|---|---|
| OTP inválido (1ª ou 2ª tentativa) | Mostrar erro, manter na tela A07 |
| OTP inválido (3ª tentativa) | Tela bloqueada por 15 min, botão "Reenviar" desabilitado com timer |
| OTP expirado (5 min) | Mostrar "Código expirado", permitir reenvio |
| Telefone bloqueado (`otp_lock`) | Exibir contador regressivo de 15 min |
| Verificação expirou antes do cadastro (30 min) | Redirecionar para A06, pedir OTP novamente |

---

## 🗂️ Estado global

### Zustand — estado de UI e autenticação

```typescript
// store/authStore.ts
import { create } from 'zustand';
import { storage } from '@/utils/storage';

type TipoUsuario = 'CLIENTE' | 'PROFISSIONAL';

interface User { id: number; nome: string; tipo: TipoUsuario }

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setTokens: (access: string, refresh: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,

  setTokens: async (access, refresh, user) => {
    await storage.set('refreshToken', refresh);
    set({ accessToken: access, user });
  },

  logout: async () => {
    await storage.delete('refreshToken');
    set({ accessToken: null, user: null });
  },
}));
```

> **Por que não guardar o accessToken no SecureStore?** O access token dura apenas 15 minutos. Guardá-lo em memória (Zustand) é suficiente e mais rápido. O refresh token fica no SecureStore pois sobrevive a reinicializações do app.

### SWR — estado do servidor

SWR gerencia todo dado que vem da API. Exemplos de uso:

```typescript
// features/orders/hooks/useOrders.ts
import useSWR from 'swr';
import { orderService } from '../service';

export const ordersKeys = {
  all: '/pedidos',
  detail: (id: number) => `/pedidos/${id}`,
};

export function useOrders() {
  return useSWR(ordersKeys.all, orderService.listar, {
    dedupingInterval: 30_000, // 30 segundos — pedidos mudam com moderada frequência
  });
}

export function useOrderDetail(id: number) {
  return useSWR(ordersKeys.detail(id), () => orderService.buscarPorId(id), {
    dedupingInterval: 10_000,
  });
}
```

---

## 🧩 Tipos compartilhados com o backend

Todos os enums do backend Java são espelhados em TypeScript para eliminar erros de contrato:

```typescript
// types/enums.ts

export type CategoriaServico =
  | 'ELETRICA' | 'PEDREIRO' | 'ENCANAMENTO'
  | 'PINTURA'  | 'AR_CONDICIONADO';

export type Urgencia = 'BAIXA' | 'NORMAL' | 'URGENTE';

export type StatusPedido =
  | 'ABERTO' | 'EM_ANDAMENTO' | 'AGUARDANDO_VALIDACAO'
  | 'CONCLUIDO' | 'CANCELADO' | 'EM_DISPUTA';

export type StatusProposta = 'PENDENTE' | 'ACEITA' | 'REJEITADA' | 'EXPIRADA';

export type StatusConversa = 'ABERTA' | 'SOMENTE_LEITURA' | 'FECHADA';

export type StatusPagamento =
  | 'PENDENTE' | 'CAPTURADO' | 'LIBERADO' | 'REEMBOLSO' | 'EM_DISPUTA';

export type MetodoPagamento = 'PIX' | 'CARTAO_CREDITO';

export type StatusVerificacao = 'NAO_ENVIADO' | 'PENDENTE' | 'APROVADO' | 'REJEITADO';

export type TipoNotificacao =
  | 'NOVO_PEDIDO'    | 'NOVA_PROPOSTA'      | 'PROPOSTA_ACEITA'
  | 'NOVA_MENSAGEM'  | 'SERVICO_CONCLUIDO'  | 'PAGAMENTO_LIBERADO'
  | 'DISPUTA_ABERTA' | 'AVALIACAO_RECEBIDA' | 'VERIFICACAO_APROVADA';

export type MotivoDenuncia =
  | 'FRAUDE' | 'ASSEDIO' | 'SERVICO_RUIM' | 'NAO_COMPARECEU'
  | 'CONTATO_FORA_APP' | 'PERFIL_FALSO' | 'OUTRO';

export type TipoUsuario = 'CLIENTE' | 'PROFISSIONAL' | 'ADMIN';
```

### Máquina de estados do pedido

```typescript
// features/orders/machine.ts
import type { StatusPedido } from '@/types/enums';

// Mapa de quais ações são permitidas em cada status
export const TRANSICOES_PEDIDO: Record<StatusPedido, StatusPedido[]> = {
  ABERTO:               ['EM_ANDAMENTO', 'CANCELADO'],
  EM_ANDAMENTO:         ['AGUARDANDO_VALIDACAO'],
  AGUARDANDO_VALIDACAO: ['CONCLUIDO', 'EM_DISPUTA'],
  CONCLUIDO:            [],
  CANCELADO:            [],
  EM_DISPUTA:           ['CONCLUIDO', 'CANCELADO'],
};

export function podeTransicionar(atual: StatusPedido, proximo: StatusPedido): boolean {
  return TRANSICOES_PEDIDO[atual].includes(proximo);
}
```

---

## 📦 Instalação de dependências

Execute após clonar o repositório e instalar as dependências base:

```bash
# Estado e dados
npm install swr zustand

# Formulários e validação
npm install react-hook-form zod @hookform/resolvers

# HTTP
npm install axios

# WebSocket (chat em tempo real)
npm install @stomp/stompjs

# Styling
npm install nativewind tailwindcss

# Geolocalização e mapas
npx expo install expo-location react-native-maps

# Storage seguro para tokens
npx expo install expo-secure-store

# Notificações push (FCM)
npx expo install expo-notifications expo-device

# Animações (BottomSheet, Skeleton)
npx expo install react-native-reanimated react-native-gesture-handler
```

---

## ✅ Convenções de código

### Nomenclatura

| Artefato | Convenção | Exemplo |
|---|---|---|
| Componentes | PascalCase | `OrderCard.tsx` |
| Hooks | camelCase com prefixo `use` | `useOrders.ts` |
| Services | camelCase com sufixo `Service` | `orderService` |
| Stores Zustand | camelCase com sufixo `Store` | `authStore` |
| Query keys | objeto constante com sufixo `Keys` | `ordersKeys` |
| Arquivos de tipo | camelCase ou enums | `types.ts`, `enums.ts` |
| Telas (app/) | kebab-case | `forgot-password.tsx` |

### Regra de ouro: telas são finas

Telas em `app/` **não contêm lógica de negócio**. Elas:
1. Chamam um hook da `feature/` correspondente
2. Renderizam o que o hook retorna
3. Delegam ações de volta ao hook

```typescript
// ✅ Correto — tela fina
export default function OrdersScreen() {
  const { data, isLoading, error } = useOrders();
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorView />;
  return <FlatList data={data} renderItem={({ item }) => <OrderCard order={item} />} />;
}

// ❌ Errado — lógica de negócio na tela
export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get('/pedidos').then(r => setOrders(r.data)); // não faça isso
  }, []);
  ...
}
```

### Tratamento de erros da API

O backend retorna `ResponseStatusException` com corpo `{ status, error, message }`. Crie um helper para extrair a mensagem:

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

## 🧪 Testes

O projeto segue TDD com o padrão de 3 arquivos por página e mocks globais para módulos nativos.

### Pilha de testes

| Camada | Arquivo | Função |
|---|---|---|
| Config | `jest.config.js` | Preset `jest-expo`, aliases (`@/`, `@tests/`), moduleNameMapper para módulos nativos |
| Setup | `jest.setup.ts` | Bootstrap do React Native, gesture-handler, reanimated, stub do expo-modules-core |
| Mocks globais | `__mocks__/` (5 arquivos) | Substituem módulos nativos inacessíveis no Node.js |
| Utilities | `__tests__/test-utils.tsx` | `render()` customizado com provider SWR; re-exporta tudo do RNTL |
| Factories | `__tests__/factories/` | Funções geradoras de dados de teste (`createMockPedido`, `createMockUser`) |

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

Cada diretório de página contém até 3 arquivos:
- `<page>.test.tsx` — teste de integração da tela (renderiza a screen, verifica wiring hook → componente)
- `<Component>.test.tsx` — teste unitário do componente (provas via props, todos os estados visuais)
- `<Hook>.test.ts` — teste unitário do hook (`renderHook`, transições de estado, chamadas ao service)

### O que NUNCA mockar

- **Zustand stores** — Use `useStore.setState({...})` no `beforeEach`. A store real funciona no ambiente de teste.
- **react-hook-form** — Use `useForm` real. Crie um componente `TestHarness` que chama `useForm` e renderiza o componente com o `control` real.
- **Zod schemas** — Deixe validar normalmente. Se um teste falhar com erro de validação, corrija os valores de teste para atenderem o schema.
- **SWR** — O `test-utils.tsx` já provê um `SWRConfig` com cache em Map e `dedupingInterval: 0`. Nenhum mock adicional necessário.

### Mocks globais (`__mocks__/`)

Aplicados via `moduleNameMapper` em `jest.config.js`. **Nunca use `jest.mock()` inline para estes módulos** — o mock global já cobre todos os testes:

| Mock | Substitui | Motivo |
|---|---|---|
| `expo-router.ts` | Roteador file-based | `useRouter`, `Stack`, `Link` dependem de primitivas nativas |
| `expo-secure-store.ts` | Keychain/Keystore | Armazenamento criptografado nativo |
| `expo-symbols.ts` | SF Symbols | Views nativas exclusivas do iOS |
| `react-native-safe-area-context.ts` | Safe area insets | Métricas nativas de tela |
| `fileMock.js` | Imagens/assets | `require('./logo.png')` retorna string |

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

---

## 🤝 Como contribuir

A ordem natural de implementar uma feature é de baixo para cima:

```
1. types.ts     → defina os tipos TypeScript espelhando o backend
2. service.ts   → implemente as chamadas Axios
3. hooks/       → crie os hooks SWR / mutations
4. components/  → construa os componentes da feature
5. app/         → crie a tela (fina!) usando os hooks
```

### Fluxo de Pull Request

1. Crie uma branch a partir de `develop`:
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. Implemente seguindo a ordem acima

3. Verifique se o linter passa:
   ```bash
   npx expo lint
   ```

4. Abra o PR para `develop` referenciando a tela ou fluxo do documento (ex: `Fluxo 5 - Criar pedido`, `Tela C02`)

5. Após revisão e aprovação, merge em `develop`

---

## 👥 Time

| Função | Responsável |
|---|---|
| | |
| | |
| | |
| | |

---

## 📄 Licença

Projeto acadêmico — **NaHora!** © 2025. Todos os direitos reservados.

---

<div align="center">

**Feito com ☕ e muito TypeScript em Recife/PE**

</div>
