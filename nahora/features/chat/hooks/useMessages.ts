import useSWR from "swr";
import { useState, useRef, useEffect } from "react";
import { chatService } from "../service";
import type { Mensagem } from "../types";

export function useMessages(conversaId: number) {
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);
  const [allMessages, setAllMessages] = useState<Mensagem[]>([]);
  const [seenIds] = useState(() => new Set<number>());

  const lastConversaId = useRef(conversaId);

  if (lastConversaId.current !== conversaId) {
    lastConversaId.current = conversaId;
    pageRef.current = 0;
    seenIds.clear();
    if (page !== 0) setPage(0);
    if (allMessages.length > 0) setAllMessages([]);
  }

  const key = conversaId ? `mensagens-${conversaId}-${page}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
      key,
      () => chatService.listarMensagens(conversaId, page, 50),
      {
        revalidateOnFocus: false,
      }
  );

  useEffect(() => {
    if (!data?.content) return;

    setAllMessages((prev) => {
      const newMsgs = data.content.filter((m) => !seenIds.has(m.id));

      if (newMsgs.length === 0 && prev.length === 0 && data.content.length > 0) {
        data.content.forEach((m) => seenIds.add(m.id));
        return data.content;
      }

      if (newMsgs.length === 0) return prev;

      newMsgs.forEach((m) => seenIds.add(m.id));

      if (pageRef.current === 0) {
        if (prev.length === 0) {
          return data.content;
        }
        // Novas mensagens da página 0 entram no FINAL do histórico existente
        return [...prev, ...newMsgs];
      } else {
        // Páginas antigas (histórico carregado ao rolar) entram no TOPO
        return [...newMsgs, ...prev];
      }
    });
  }, [data, seenIds]);

  const loadMore = () => {
    if (data && !data.last) {
      const next = page + 1;
      pageRef.current = next;
      setPage(next);
    }
  };

  const hasMore = data ? !data.last : false;

  const appendIncoming = (msg: Mensagem) => {
    if (seenIds.has(msg.id)) {
      setAllMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === msg.id);
        if (idx === -1) return prev;
        const updated = [...prev];
        updated[idx] = { ...updated[idx], status: msg.status };
        return updated;
      });

      mutate((cachedData: any) => {
        if (!cachedData?.content) return cachedData;
        return {
          ...cachedData,
          content: cachedData.content.map((m: Mensagem) =>
              m.id === msg.id ? { ...m, status: msg.status } : m
          ),
        };
      }, false);
      return;
    }

    seenIds.add(msg.id);
    // Mensagem em tempo real entra no FINAL do array local (fundo da tela)
    setAllMessages((prev) => [...prev, msg]);

    // Mensagem em tempo real entra no FINAL do cache do SWR
    mutate((cachedData: any) => {
      if (!cachedData?.content) return cachedData;
      if (cachedData.content.some((m: Mensagem) => m.id === msg.id)) return cachedData;

      return {
        ...cachedData,
        content: [...cachedData.content, msg],
      };
    }, false);
  };

  const updateMessageStatusByContent = (
      conteudo: string,
      novoStatus: Mensagem["status"],
  ) => {
    setAllMessages((prev) => {
      // 👇 AJUSTE: Voltamos para findLastIndex para encontrar o envio pendente mais recente
      const idx = prev.findLastIndex(
          (m) => m.conteudo === conteudo && m.status === "ENVIADA",
      );
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], status: novoStatus };
      return updated;
    });

    // Sincroniza o status no cache global
    mutate((cachedData: any) => {
      if (!cachedData?.content) return cachedData;
      return {
        ...cachedData,
        content: cachedData.content.map((m: Mensagem) =>
            m.conteudo === conteudo && m.status === "ENVIADA"
                ? { ...m, status: novoStatus }
                : m
        ),
      };
    }, false);
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