import { useMemo, useCallback } from "react";
import { useMessages } from "./useMessages";
import { useChat } from "./useChat";
import { useConversa } from "./useConversa";
import { groupMessagesByDate } from "@/utils/formatters";
import type { ConnectionStatus } from "../stompClient";

export function useChatScreen(conversaId: number) {
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
  } = useChat(conversaId, appendIncoming);

  const { conversa, isLoading: conversaLoading } = useConversa(conversaId);

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
  };
}
