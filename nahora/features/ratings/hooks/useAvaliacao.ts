import useSWR from "swr";
import { avaliacaoService } from "../service";
import type { AvaliacaoResponse } from "../types";

/**
 * Hook que retorna a avaliação do usuário logado para um pedido.
 *
 * - `jaAvaliou: true` → usuário já avaliou
 * - `jaAvaliou: false` → usuário ainda não avaliou (404)
 * - `avaliacao` → os dados da avaliação, se existir
 */
export function useAvaliacao(pedidoId: number | undefined) {
  const { data, error, isLoading } = useSWR(
    pedidoId ? `avaliacao-pedido-${pedidoId}` : null,
    () => avaliacaoService.buscarPorPedido(pedidoId!),
  );

  return {
    avaliacao: data as AvaliacaoResponse | null | undefined,
    jaAvaliou: data !== null && data !== undefined,
    isLoading,
    error,
  };
}
