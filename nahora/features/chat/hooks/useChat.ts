import { useEffect, useState, useCallback, useRef, useReducer } from "react";
import { chatWsManager } from "../stompClient";
import type { ConnectionStatus } from "../stompClient";
import type { Mensagem } from "../types";

const IA_BLOCK_TIMEOUT = 3000;

// ── Connection state reducer (one dispatch instead of 3 cascading setStates) ─

interface ConnectionState {
  status: ConnectionStatus;
  error: string | null;
}

type ConnectionAction =
  | { type: "SET_STATUS"; status: ConnectionStatus }
  | { type: "SET_CONNECTED" }
  | { type: "SET_DISCONNECTED"; error: string | null };

function connectionReducer(
  state: ConnectionState,
  action: ConnectionAction,
): ConnectionState {
  switch (action.type) {
    case "SET_STATUS":
      return { ...state, status: action.status };
    case "SET_CONNECTED":
      return { status: "CONNECTED", error: null };
    case "SET_DISCONNECTED":
      return { status: "DISCONNECTED", error: action.error };
  }
}

export function useChat(
  conversaId: number,
  onMessage?: (msg: Mensagem) => void,
  onEcho?: (conteudo: string) => void,
) {
  const [conn, dispatch] = useReducer(connectionReducer, {
    status: chatWsManager.connectionStatus,
    error: chatWsManager.lastError,
  });
  const [isSending, setIsSending] = useState(false);
  const [iaBlocked, setIaBlocked] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSentRef = useRef<string | null>(null);

  useEffect(() => {
    dispatch({ type: "SET_STATUS", status: chatWsManager.connectionStatus });
    const unsub = chatWsManager.onStatusChange((status) => {
      if (status === "DISCONNECTED") {
        dispatch({ type: "SET_DISCONNECTED", error: chatWsManager.lastError });
      } else if (status === "CONNECTED") {
        dispatch({ type: "SET_CONNECTED" });
      } else {
        dispatch({ type: "SET_STATUS", status });
      }
    });
    return unsub;
  }, []); // dispatch & chatWsManager are stable

  // react-doctor-disable-next-line react-doctor/exhaustive-deps — timeoutRef.current intentionally read at cleanup time for latest value
  useEffect(() => {
    if (!conversaId) return;

    if (!chatWsManager.getClient()?.active) {
      chatWsManager.connect();
    }

    chatWsManager.subscribe(conversaId, (msg: Mensagem) => {
      const isEcho =
        lastSentRef.current &&
        timeoutRef.current &&
        msg.conteudo === lastSentRef.current;

      if (isEcho) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        lastSentRef.current = null;
        setIsSending(false);
        // Notifica que o echo chegou → status pode transicionar para ENTREGUE
        onEcho?.(msg.conteudo);
        // Não chama onMessage para evitar duplicação (echo já representa
        // a mensagem que entrará na lista com status ENVIADA do backend)
        return;
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
  }, [conversaId, onEcho, onMessage]);

  const sendMessage = (conteudo: string, anexoUrl?: string) => {
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
  };

  const isConnected =
    conn.status === "CONNECTED";

  return {
    connectionStatus: conn.status,
    isSending,
    isConnected,
    iaBlocked,
    sendMessage,
    clearIaBlocked: () => setIaBlocked(false),
    connectionError: conn.error,
  };
}
