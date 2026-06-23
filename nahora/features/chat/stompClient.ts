import { Client, StompSubscription } from "@stomp/stompjs";
import { AppState } from "react-native";
import type { Mensagem } from "./types";
import { WS_URL } from "@/services/api/endpoints";

export type ConnectionStatus =
  | "CONNECTING"
  | "CONNECTED"
  | "DISCONNECTED"
  | "RECONNECTING";

type StatusListener = (status: ConnectionStatus) => void;
type MessageHandler = (msg: Mensagem) => void;

class ChatWebSocketManager {
  private client: Client | null = null;
  private subscriptions = new Map<number, StompSubscription>();
  private messageHandlers = new Map<number, MessageHandler>();
  private statusListeners = new Set<StatusListener>();
  private appStateSub: { remove: () => void } | null = null;
  private _connectionStatus: ConnectionStatus = "DISCONNECTED";
  private pendingReconnect = false;
  private _lastError: string | null = null;
  private _authToken: string | null = null;

  setToken(token: string | null): void {
    this._authToken = token;
  }

  get lastError(): string | null {
    return this._lastError;
  }

  get connectionStatus(): ConnectionStatus {
    return this._connectionStatus;
  }

  private setConnectionStatus(status: ConnectionStatus) {
    this._connectionStatus = status;
    this.statusListeners.forEach((fn) => fn(status));
  }

  connect(): void {
    if (this.client?.active) return;
    if (!this._authToken) return;

    if (!WS_URL) return;

    this._lastError = null;
    this.setConnectionStatus("CONNECTING");

    this.client = new Client({
      brokerURL: WS_URL,
      connectHeaders: {
        Authorization: `Bearer ${this._authToken}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      connectionTimeout: 10_000,
      debug: __DEV__ ? (msg: string) => console.log("[WS]", msg) : () => {},

      webSocketFactory: () => new WebSocket(WS_URL),

      onConnect: () => {
        this._lastError = null;
        this.setConnectionStatus("CONNECTED");
        this.pendingReconnect = false;
        this.resubscribeAll();
      },

      onDisconnect: () => {
        this.setConnectionStatus("DISCONNECTED");
      },

      onStompError: (frame) => {
        const msg = frame.headers?.message ?? "";
        this._lastError = msg || "Erro STOMP desconhecido";

        if (
          msg.toLowerCase().includes("auth") ||
          msg.includes("401") ||
          msg.includes("403")
        ) {
          this.setConnectionStatus("DISCONNECTED");
          this.client?.deactivate();
        } else {
          this.setConnectionStatus("DISCONNECTED");
        }
      },

      onWebSocketClose: (evt) => {
        if (this._connectionStatus === "CONNECTED") {
          this.setConnectionStatus("RECONNECTING");
        } else if (this._connectionStatus === "CONNECTING") {
          this._lastError =
            this._lastError ?? `WebSocket fechado (código ${evt?.code ?? "?"})`;
          this.setConnectionStatus("DISCONNECTED");
        }
      },
    });

    this.client.activate();
    this.setupAppState();
  }

  disconnect(): void {
    this.teardownAppState();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.messageHandlers.clear();
    this.client?.deactivate();
    this.client = null;
    this._lastError = null;
    this.setConnectionStatus("DISCONNECTED");
  }

  subscribe(conversaId: number, handler: MessageHandler): void {
    this.messageHandlers.set(conversaId, handler);

    if (this.subscriptions.has(conversaId)) return;

    const doSubscribe = () => {
      if (!this.client?.connected) return;
      if (this.subscriptions.has(conversaId)) return;

      const sub = this.client.subscribe(
        `/topic/conversa/${conversaId}`,
        (frame) => {
          const handler = this.messageHandlers.get(conversaId);
          if (handler) {
            const msg: Mensagem = JSON.parse(frame.body);
            handler(msg);
          }
        },
      );
      this.subscriptions.set(conversaId, sub);
    };

    if (this.client?.connected) {
      doSubscribe();
    }
  }

  unsubscribe(conversaId: number): void {
    const sub = this.subscriptions.get(conversaId);
    if (sub) {
      sub.unsubscribe();
      this.subscriptions.delete(conversaId);
    }
    this.messageHandlers.delete(conversaId);
  }

  send(conversaId: number, conteudo: string, anexoUrl?: string): boolean {
    if (!this.client?.connected) return false;
    this.client.publish({
      destination: `/app/chat/${conversaId}/enviar`,
      body: JSON.stringify({ conteudo, anexoUrl: anexoUrl ?? null }),
    });
    return true;
  }

  onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  refreshConnection(newToken: string): void {
    this._authToken = newToken;
    this.disconnect();
    this.connect();
  }

  getClient(): Client | null {
    return this.client;
  }

  private resubscribeAll(): void {
    const ids = Array.from(this.messageHandlers.keys());
    for (const id of ids) {
      const sub = this.subscriptions.get(id);
      if (sub) {
        sub.unsubscribe();
        this.subscriptions.delete(id);
      }
    }
    for (const id of ids) {
      const handler = this.messageHandlers.get(id);
      if (handler && this.client?.connected) {
        const sub = this.client.subscribe(`/topic/conversa/${id}`, (frame) => {
          const h = this.messageHandlers.get(id);
          if (h) {
            const msg: Mensagem = JSON.parse(frame.body);
            h(msg);
          }
        });
        this.subscriptions.set(id, sub);
      }
    }
  }

  private setupAppState(): void {
    this.teardownAppState();
    this.appStateSub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        if (this._connectionStatus === "DISCONNECTED" && !this.client?.active) {
          this.connect();
        }
      } else {
        this.setConnectionStatus("DISCONNECTED");
        this.client?.deactivate();
      }
    });
  }

  private teardownAppState(): void {
    this.appStateSub?.remove();
    this.appStateSub = null;
  }
}

export const chatWsManager = new ChatWebSocketManager();

export function getStompClient(): Client {
  if (!chatWsManager.getClient()?.active) {
    chatWsManager.connect();
  }
  return chatWsManager.getClient()!;
}

export function disconnectStomp() {
  chatWsManager.disconnect();
}
