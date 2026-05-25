import { useEffect, useState, useCallback, useRef } from "react";
import { chatWsManager } from "../stompClient";
import type { ConnectionStatus } from "../stompClient";
import type { Mensagem } from "../types";

const IA_BLOCK_TIMEOUT = 3000;

export function useChat(conversaId: number, onMessage?: (msg: Mensagem) => void) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    chatWsManager.connectionStatus,
  );
  const [isSending, setIsSending] = useState(false);
  const [iaBlocked, setIaBlocked] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(
    chatWsManager.lastError,
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSentRef = useRef<string | null>(null);

  useEffect(() => {
    setConnectionStatus(chatWsManager.connectionStatus);
    const unsub = chatWsManager.onStatusChange((status) => {
      setConnectionStatus(status);
      if (status === "DISCONNECTED") {
        setConnectionError(chatWsManager.lastError);
      } else if (status === "CONNECTED") {
        setConnectionError(null);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!conversaId) return;

    if (!chatWsManager.getClient()?.active) {
      chatWsManager.connect();
    }

    chatWsManager.subscribe(conversaId, (msg: Mensagem) => {
      if (
        lastSentRef.current &&
        timeoutRef.current &&
        msg.conteudo === lastSentRef.current
      ) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        lastSentRef.current = null;
        setIsSending(false);
      }
      onMessage?.(msg);
    });

    return () => {
      chatWsManager.unsubscribe(conversaId);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [conversaId]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(
    (conteudo: string, anexoUrl?: string) => {
      if (!conversaId || !conteudo.trim()) return;

      setIsSending(true);
      lastSentRef.current = conteudo;

      timeoutRef.current = setTimeout(() => {
        setIsSending(false);
        setIaBlocked(true);
        timeoutRef.current = null;
        lastSentRef.current = null;
      }, IA_BLOCK_TIMEOUT);

      const sent = chatWsManager.send(conversaId, conteudo.trim(), anexoUrl);
      if (!sent) {
        setIsSending(false);
        setIaBlocked(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        lastSentRef.current = null;
      }
    },
    [conversaId],
  );

  const isConnected =
    connectionStatus === "CONNECTED";

  return {
    connectionStatus,
    isSending,
    isConnected,
    iaBlocked,
    sendMessage,
    clearIaBlocked: () => setIaBlocked(false),
    connectionError,
  };
}
