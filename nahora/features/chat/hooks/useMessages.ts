import useSWR from "swr";
import { useState, useRef } from "react";
import { chatService } from "../service";
import type { Mensagem } from "../types";

export function useMessages(conversaId: number) {
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);
  const [allMessages, setAllMessages] = useState<Mensagem[]>([]);
  // useState with lazy initializer — the Set is created once,
  // its identity never changes, and it avoids ref-during-render
  const [seenIds] = useState(() => new Set<number>());

  const key = conversaId ? `mensagens-${conversaId}-${page}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    () => chatService.listarMensagens(conversaId, page, 50),
    {
      revalidateOnFocus: false,
      onSuccess: (newData) => {
        if (newData?.content) {
          if (pageRef.current === 0) {
            newData.content.forEach((m) => seenIds.add(m.id));
            setAllMessages(newData.content);
          } else {
            const newMsgs = newData.content.filter(
              (m) => !seenIds.has(m.id),
            );
            newMsgs.forEach((m) => seenIds.add(m.id));
            setAllMessages((prev) => [...newMsgs, ...prev]);
          }
        }
      },
    },
  );

  const loadMore = () => {
    if (data && !data.last) {
      const next = page + 1;
      pageRef.current = next;
      setPage(next);
    }
  };

  const hasMore = data ? !data.last : false;

  const appendIncoming = (msg: Mensagem) => {
    if (seenIds.has(msg.id)) return;
    seenIds.add(msg.id);
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
    isLoading:
      page === 0 && (isLoading || (isValidating && allMessages.length === 0)),
    isValidating,
    isError: !!error,
    loadMore,
    hasMore,
    refresh: mutate,
    appendIncoming,
    updateMessageStatusByContent,
  };
}
