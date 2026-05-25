import useSWR from "swr";
import { chatService } from "../service";

export function useConversaPorProposta(propostaId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    propostaId ? `conversa-por-proposta-${propostaId}` : null,
    () => chatService.buscarPorProposta(propostaId),
    { revalidateOnFocus: false },
  );

  return {
    conversa: data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
