import { useMemo, useCallback } from "react";
import { useMessages } from "./useMessages";
import { useChat } from "./useChat";
import { useConversaPorProposta } from "./useConversa";
import { groupMessagesByDate } from "@/utils/formatters";
import type { ConnectionStatus } from "../stompClient";

export function useChatScreen(propostaId: number) {
  const { conversa, isLoading: conversaLoading } = useConversaPorProposta(propostaId);
  const conversaId = conversa?.id;

  const {
    messages,
    isLoading: msgsLoading,
    isValidating,
    isError,
    loadMore,
    hasMore,
    refresh,
    appendIncoming,
  } = useMessages(conversaId);

  const {
    connectionStatus,
    isSending,
    isConnected,
    iaBlocked,
    sendMessage,
    clearIaBlocked,
    connectionError,
  } = useChat(conversaId, appendIncoming);

  const groupedMessages = useMemo(
    () => groupMessagesByDate(messages),
    [messages],
  );

  const sendWithFeedback = useCallback(
    (text: string) => {
      clearIaBlocked();
      sendMessage(text);
    },
    [sendMessage, clearIaBlocked],
  );

  const isLoading = msgsLoading || conversaLoading;

  return {
    messages: groupedMessages,
    messageCount: messages.length,
    isLoading,
    isValidating,
    isError,
    loadMore,
    hasMore,
    refresh,
    sendMessage: sendWithFeedback,
    isSending,
    connectionStatus,
    isConnected,
    iaBlocked,
    clearIaBlocked,
    conversa,
    connectionError,
  };
}
