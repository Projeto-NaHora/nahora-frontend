import { useMemo, useCallback, useState } from "react";
import { useMessages } from "./useMessages";
import { useChat } from "./useChat";
import { useConversaPorProposta } from "./useConversa";
import { groupMessagesByDate } from "@/utils/formatters";
import { validarMensagem } from "../validation";
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
    updateMessageStatusByContent,
  } = useMessages(conversaId);

  const onEcho = (conteudo: string) => {
    updateMessageStatusByContent(conteudo, "ENTREGUE");
  };

  const {
    connectionStatus,
    isSending,
    isConnected,
    iaBlocked,
    sendMessage,
    clearIaBlocked,
    connectionError,
  } = useChat(conversaId, appendIncoming, onEcho);

  const [validationError, setValidationError] = useState<string | null>(null);

  const groupedMessages = (() => groupMessagesByDate(messages))();

  const sendWithFeedback = (text: string) => {
    clearIaBlocked();
    setValidationError(null);

    const resultado = validarMensagem(text);
    if (!resultado.valida) {
      setValidationError(resultado.erro ?? null);
      return;
    }

    sendMessage(text);
  };

  const clearValidationError = () => setValidationError(null);

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
    validationError,
    clearValidationError,
  };
}
