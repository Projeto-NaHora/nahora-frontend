// features/chat/stompClient.ts
import { Client } from "@stomp/stompjs";
import { useAuthStore } from "@/store/authStore";

let client: Client | null = null;

export function getStompClient(): Client {
  if (client?.active) return client;

  client = new Client({
    brokerURL: process.env.EXPO_PUBLIC_WS_URL,
    connectHeaders: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    },
    reconnectDelay: 5000,
    onDisconnect: () => console.log("[WS] Desconectado"),
  });

  client.activate();
  return client;
}

export function disconnectStomp() {
  client?.deactivate();
  client = null;
}
