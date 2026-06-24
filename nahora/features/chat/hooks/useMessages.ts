import useSWR from "swr";
import { useState, useEffect, useCallback, useRef } from "react";
import { chatService } from "../service";
import type { Mensagem } from "../types";

export function useMessages(conversaId: number) {
  const [page, setPage] = useState(0);
  const [allMessages, setAllMessages] = useState<Mensagem[]>([]);
  const seenIds = useRef(new Set<number>());

  const key = conversaId ? `mensagens-${conversaId}-${page}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    () => chatService.listarMensagens(conversaId, page, 50),
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (data?.content) {
      if (page === 0) {
        data.content.forEach((m) => seenIds.current.add(m.id));
        setAllMessages(data.content);
      } else {
        const newMsgs = data.content.filter((m) => !seenIds.current.has(m.id));
        newMsgs.forEach((m) => seenIds.current.add(m.id));
        setAllMessages((prev) => [...newMsgs, ...prev]);
      }
    }
  }, [data, page]);

  const loadMore = () => {
    if (data && !data.last) {
      setPage((p) => p + 1);
    }
  };

  const hasMore = data ? !data.last : false;

  const appendIncoming = (msg: Mensagem) => {
    if (seenIds.current.has(msg.id)) return;
    seenIds.current.add(msg.id);
    setAllMessages((prev) => [...prev, msg]);
  };

  const updateMessageStatusByContent = (
    conteudo: string,
    novoStatus: Mensagem["status"],
  ) => {
    setAllMessages((prev) => {
      const idx = prev.findLastIndex(
        (m) => m.conteudo === conteudo && m.status === "ENVIADA",
      );
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], status: novoStatus };
      return updated;
    });
  };

  return {
    messages: allMessages,
    isLoading: page === 0 && (isLoading || (isValidating && allMessages.length === 0)),
    isValidating,
    isError: !!error,
    loadMore,
    hasMore,
    refresh: mutate,
    appendIncoming,
    updateMessageStatusByContent,
  };
}
