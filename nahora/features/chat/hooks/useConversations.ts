import useSWRInfinite from "swr/infinite";
import { conversationService } from "../service";
import type { ConversaResponseDTO, FiltroConversaStatus } from "../types";
import { STATUS_FILTER_MAP } from "../types";

const PAGE_SIZE = 20;

export function useConversations(filtro: FiltroConversaStatus = "TODAS") {
  const statusParam = STATUS_FILTER_MAP[filtro];

  const { data, size, setSize, isLoading, isValidating, error, mutate } =
    useSWRInfinite(
      (pageIndex, previousPageData) => {
        if (previousPageData && previousPageData.last) return null;
        return ["conversas", statusParam, pageIndex, PAGE_SIZE];
      },
      ([, status, pageIndex, size]) =>
        conversationService.listar(status, pageIndex, size),
      {
        revalidateFirstPage: false,
      },
    );

  const conversations: ConversaResponseDTO[] =
    data?.flatMap((page) => page.content) ?? [];
  const hasMore = data ? !(data[data.length - 1]?.last) : true;
  const isLoadingMore = isValidating && data !== undefined && data.length > 0;

  return {
    conversations,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    refresh: () => mutate(),
    loadMore: () => {
      if (!hasMore || isLoadingMore) return;
      setSize(size + 1);
    },
  };
}
