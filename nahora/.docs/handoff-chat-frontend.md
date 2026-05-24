# Chat + WebSocket Frontend Handoff (React Native + STOMP.js)

## What exists on the backend

The backend runs STOMP over WebSocket at `/ws`. Authentication happens on the CONNECT frame (not HTTP). Messages flow through `/app/chat/{conversaId}/enviar` (send) and `/topic/conversa/{conversaId}` (receive). Three REST endpoints provide conversation list, paginated history, and conversation-by-order lookup.

## Domain glossary

| Term | Meaning |
|---|---|
| **Conversa** | A chat conversation between a cliente and a profissional, created when a proposta is made on a pedido. One conversation per proposta. |
| **Mensagem** | An individual message within a conversa. Has status ENVIADA → ENTREGUE → LIDA. |
| **StatusConversa** | Lifecycle: ABERTA (can chat) → SOMENTE_LEITURA (read-only, service completed) → EM_DISPUTA (re-opened for dispute) → FECHADA (done). |
| **StatusMensagem** | Delivery tracking: ENVIADA, ENTREGUE, LIDA |
| **Pedido** | A service order posted by a cliente. |
| **Proposta** | A bid/offer from a profissional on a pedido. |

---

## 1. WebSocket connection

### Endpoint

```
ws://<host>/ws
```

The backend registers `/ws` as a STOMP-over-WebSocket endpoint with SockJS fallback. **In React Native you cannot use SockJS** — use raw WebSocket transport (`@stomp/stompjs` supports this via `Stomp.over()` with a raw WebSocket factory, or use the `webSocketFactory` config option).

### Authentication (critical)

The JWT must be passed as a STOMP native header on the CONNECT frame. The backend interceptor in `ChatWebSocketConfig` reads it from there — it does NOT look at URL query params or cookies.

```ts
import { Client } from '@stomp/stompjs';

const client = new Client({
  brokerURL: 'ws://<host>/ws',
  connectHeaders: {
    Authorization: `Bearer ${jwtToken}`,  // ← this is what the backend reads
  },
  // React Native: disable SockJS, use raw WebSocket
  webSocketFactory: () => new WebSocket('ws://<host>/ws'),
  reconnectDelay: 5000,
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,
  debug: __DEV__ ? console.log : () => {},
});
```

The backend validates the JWT from this header: extracts email, loads the user, checks signature + expiration, and binds the Spring Security principal to the STOMP session. If the token is invalid or expired, the CONNECT frame is rejected.

### Connection lifecycle

- `onConnect` — subscribe to conversations the user is part of
- `onDisconnect` — handle reconnection; exponential backoff
- `onStompError` — if the error header contains "auth" or "401", refresh the JWT before reconnecting

### App state handling (React Native specific)

When the app goes to background, STOMP heartbeats will fail. Either:
- Disconnect on background + reconnect on foreground (simpler, recommended)
- Keep a background service alive (complex, usually not worth it)

```ts
import { AppState } from 'react-native';

AppState.addEventListener('change', (state) => {
  if (state === 'active') client.activate();
  else client.deactivate();
});
```

---

## 2. Sending messages

### Destination

```
/app/chat/{conversaId}/enviar
```

### Request body

```json
{
  "conteudo": "Olá, tudo bem?",
  "anexoUrl": "https://..."  // optional
}
```

### via @stomp/stompjs

```ts
client.publish({
  destination: `/app/chat/${conversaId}/enviar`,
  body: JSON.stringify({
    conteudo: messageText,
    anexoUrl: attachmentUrl || null,
  }),
});
```

### Validation errors the backend may return

| Scenario | STOMP error / behavior |
|---|---|
| Empty `conteudo` | `@NotBlank` validation fails — message discarded |
| Non-participant sends | 403 AccessDeniedException |
| Status is SOMENTE_LEITURA or FECHADA | 422 Unprocessable Entity |
| IA filter blocks (profanity) | Silent — message saved to DB but NOT broadcast (only the sender sees it in history as masked) |
| IA filter blocks (contact info before proposal accepted) | Same silent treatment |

---

## 3. Receiving messages

### Topic pattern

```
/topic/conversa/{conversaId}
```

### Subscription

```ts
const subscription = client.subscribe(
  `/topic/conversa/${conversaId}`,
  (message) => {
    const msg: MensagemResponseDTO = JSON.parse(message.body);
    // append msg to local message list
  }
);
```

### Response shape (MensagemResponseDTO)

```ts
interface MensagemResponseDTO {
  id: number;
  conversaId: number;
  remetenteId: number;
  nomeRemetente: string;
  conteudo: string;
  anexoUrl: string | null;
  status: 'ENVIADA' | 'ENTREGUE' | 'LIDA';
  bloqueadaIa: boolean;
  criadoEm: string;  // ISO 8601 datetime
}
```

### Important behavior

- All participants subscribed to `/topic/conversa/{conversaId}` receive the broadcast, including the sender. Filter out by `remetenteId` on the client if you only want to show others' messages, or accept all and render differently.
- If `bloqueadaIa` is true in history, the `conteudo` field shows `"[Mensagem bloqueada por violar as diretrizes do sistema]"`. Real-time broadcast never includes blocked messages (they aren't broadcast at all).
- Messages arrive ordered by timestamp. History is queried ASC.

---

## 4. REST endpoints (for loading history and conversation list)

### List user's conversations

```
GET /api/v1/conversas?status=ABERTA,SOMENTE_LEITURA,EM_DISPUTA,FECHADA&page=0&size=20
Authorization: Bearer <jwt>
```

Returns `Page<ConversaResponseDTO>`:

```ts
interface ConversaResponseDTO {
  id: number;
  pedidoId: number;
  propostaId: number;
  status: 'ABERTA' | 'SOMENTE_LEITURA' | 'EM_DISPUTA' | 'FECHADA';
  criadoEm: string;
  tituloPedido: string;            // order description
  categoriaPedido: string;         // order category name
  nomeOutroParticipante: string;   // the other person's name
  fotoOutroParticipante: string;   // the other person's photo URL
}
```

### Get message history

```
GET /api/v1/conversas/{conversaId}/mensagens?page=0&size=50
Authorization: Bearer <jwt>
```

Returns `Page<MensagemResponseDTO>`. Side effect: marks the *other* participant's messages as LIDA (so the backend updates unread status when you view a conversation).

### Get conversation for an order

```
GET /api/v1/pedidos/{pedidoId}/conversa
Authorization: Bearer <jwt>
```

Returns `ConversaResponseDTO`. Use this to find the conversation for a specific pedido (e.g., when the user taps "Chat" on an order detail screen).

---

## 5. Screen-by-screen implementation plan

### Screen 1: Conversation List (`/conversas`)

- Fetch `GET /api/v1/conversas` on mount
- Display list with: other participant's photo + name, last message preview, order title, status badge
- Pull-to-refresh
- Infinite scroll (page-based pagination)
- Filter tabs by status (Abertas, Encerradas, Todas)
- Tapping a conversation navigates to Screen 2

### Screen 2: Chat (`/conversas/{conversaId}`)

- Fetch `GET /api/v1/conversas/{conversaId}/mensagens` on mount (initial page)
- Subscribe to `/topic/conversa/{conversaId}` via STOMP
- `FlatList` with `inverted={false}` showing messages oldest → newest
- Send bar: text input + send button + optional attachment
- Sending: `client.publish({ destination: '/app/chat/{conversaId}/enviar', ... })`
- Append incoming messages from STOMP subscription to FlatList data
- Paginate up (load older messages on scroll to top) via the REST endpoint

### State management per screen

```
Screen 1 (list):
  conversations: ConversaResponseDTO[]
  loading: boolean
  page: number
  statusFilter: string[]

Screen 2 (chat):
  messages: MensagemResponseDTO[]
  loading: boolean
  sending: boolean
  page: number
  stompSubscription: StompSubscription | null
```

---

## 6. STOMP client architecture recommendation

Create a singleton `ChatWebSocketManager` that:

```ts
class ChatWebSocketManager {
  private client: Client | null = null;
  private subscriptions: Map<number, StompSubscription> = new Map();

  connect(jwt: string): Promise<void>;
  disconnect(): void;
  subscribe(conversaId: number, onMessage: (msg: MensagemResponseDTO) => void): void;
  unsubscribe(conversaId: number): void;
  send(conversaId: number, conteudo: string, anexoUrl?: string): void;
}
```

- The `connect` promise resolves on `onConnect`, rejects on `onStompError`.
- Expose the connection state as an observable so the UI can show "Connecting..." / "Reconnecting..." banners.
- On JWT refresh, call `disconnect()` then `connect(newJwt)` — don't try to hot-swap headers on an active connection.

---

## 7. Error handling cheat sheet

| Error | HTTP/STOMP code | Frontend action |
|---|---|---|
| Invalid/expired JWT on CONNECT | STOMP ERROR | Refresh token, reconnect |
| Non-participant | 403 | Show "Access denied" — navigate away |
| Conversation read-only | 422 | Disable the send bar, show "This conversation is read-only" banner |
| IA blocked (profanity) | Silent (no broadcast) | The sender sees nothing happen. Optionally show a toast: "Message could not be sent due to content policy" — but the backend does NOT return an error, so you'd need to infer from the absence of an echo. |
| Network loss | Transport close | Show "Reconnecting..." banner, exponential backoff |

---

## 8. Dependencies

```json
{
  "@stomp/stompjs": "^7.0.0"
}
```

No native modules needed. `@stomp/stompjs` works with React Native's built-in `WebSocket`.

---

## 9. Key gotchas

1. **No SockJS in React Native.** Use `webSocketFactory: () => new WebSocket(url)` in the STOMP client config. The backend supports both raw WebSocket and SockJS, so raw WS is fine.

2. **JWT on CONNECT, not in URL.** The backend interceptor reads `Authorization` from STOMP frame native headers. Do NOT append `?token=...` to the WebSocket URL — it will be ignored.

3. **IA-blocked messages never broadcast.** If the user sends a message and nothing comes back on the topic, it was likely IA-blocked. The message is saved to DB (visible in history as masked) but not broadcast in real-time. The frontend should handle this gracefully — consider showing a confirmation toast on send success, and treating the absence of an echo as a soft failure.

4. **Message ordering.** History is returned ASC (oldest first). Real-time messages arrive as they're sent. Prepend paginated history and append real-time messages.

5. **Topic subscription auth.** The backend does NOT check topic-level authorization — anyone subscribed to `/topic/conversa/123` receives messages for conversation 123. This is by design (the STOMP session is already authenticated). But it means the frontend should only subscribe to conversations the user is actually part of.
