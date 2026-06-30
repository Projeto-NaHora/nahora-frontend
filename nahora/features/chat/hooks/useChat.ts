import { useEffect, useState, useRef, useReducer } from "react";
import { chatWsManager } from "../stompClient";
import type { ConnectionStatus } from "../stompClient";
import type { Mensagem } from "../types";

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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Refs sempre atualizados, sem forçar re-subscribe
  const onMessageRef = useRef(onMessage);
  const onEchoRef = useRef(onEcho);
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
  useEffect(() => { onEchoRef.current = onEcho; }, [onEcho]);

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
  }, []);

  useEffect(() => {
    if (!conversaId) return;

    if (!chatWsManager.getClient()?.active) {
      chatWsManager.connect();
    }

    chatWsManager.subscribe(conversaId, (msg: Mensagem) => {
      setIsSending(false);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      onMessageRef.current?.(msg);
      onEchoRef.current?.(msg.conteudo);
    });

    return () => {
      chatWsManager.unsubscribe(conversaId);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [conversaId]); // <- só depende do conversaId agora

  const sendMessage = (conteudo: string, anexoUrl?: string) => {
    if (!conversaId || !conteudo.trim()) return;

    setIsSending(true);

    timerRef.current = setTimeout(() => {
      setIsSending(false);
      setIaBlocked(true);
      timerRef.current = null;
    }, 3000);

    const sent = chatWsManager.send(conversaId, conteudo.trim(), anexoUrl);
    if (!sent) {
      setIsSending(false);
      setIaBlocked(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const isConnected = conn.status === "CONNECTED";

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