import { useEffect, useRef, useState } from "react";
import { IMessage, StompSubscription } from "@stomp/stompjs"; // Import types
import { getStompClient } from "../stompClient";
import type { Mensagem } from "../types";

export function useChat(conversaId: number, historicoInicial: Mensagem[]) {
  const [mensagens, setMensagens] = useState<Mensagem[]>(historicoInicial);

  // Use the explicit StompSubscription type from the library
  const subRef = useRef<StompSubscription | null>(null);

  useEffect(() => {
    const stomp = getStompClient();

    const subscribe = () => {
      // Check if we already have a subscription for this ID to avoid duplicates
      if (subRef.current) return;

      subRef.current = stomp.subscribe(
        `/topic/chat/${conversaId}`,
        (frame: IMessage) => {
          const nova: Mensagem = JSON.parse(frame.body);
          setMensagens((prev) => [...prev, nova]);
        },
      );
    };

    // If client is already active, subscribe immediately
    if (stomp.active && stomp.connected) {
      subscribe();
    }

    // Assign onConnect to handle initial connection or reconnection
    // Note: If using @stomp/stompjs v7+, prefer stomp.onConnect = ...
    const originalOnConnect = stomp.onConnect;
    stomp.onConnect = (frame) => {
      if (originalOnConnect) originalOnConnect(frame);
      subscribe();
    };

    return () => {
      if (subRef.current) {
        subRef.current.unsubscribe();
        subRef.current = null; // Clear the ref
      }
    };
  }, [conversaId]);

  function enviarMensagem(conteudo: string) {
    const stomp = getStompClient();
    if (stomp.active) {
      stomp.publish({
        destination: `/app/chat/${conversaId}`,
        body: JSON.stringify({ conteudo }),
      });
    }
  }

  return { mensagens, enviarMensagem };
}
