import useSWR from "swr";
import { chatService } from "../service";

export function useConversa(conversaId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    conversaId ? `conversa-${conversaId}` : null,
    () => chatService.buscarConversa(conversaId),
    { revalidateOnFocus: false },
  );

  return {
    conversa: data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
