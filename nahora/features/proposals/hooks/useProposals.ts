import { ENDPOINTS } from "@/services/api/endpoints";
import useSWR, { useSWRConfig } from "swr";
import { proposalsService } from "../service";

export function useProposalsByPedido(pedidoId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    pedidoId ? ENDPOINTS.PROPOSTAS(pedidoId) : null,
    () => proposalsService.listarPorPedido(pedidoId)
  );

  return {
    proposals: data ?? [],
    isLoading,
    isError: !!error,
    refreshProposals: mutate,
  };
}

export function useProposalDetail(pedidoId: number, propostaId: number) {
  const { data, error, isLoading } = useSWR(
    pedidoId && propostaId ? ENDPOINTS.PROPOSTA(pedidoId, propostaId) : null,
    () => proposalsService.buscarPorId(pedidoId, propostaId)
  );

  return {
    proposal: data,
    isLoading,
    isError: !!error,
  };
}

export function useProposalActions(pedidoId: number, onSuccess?: () => void) {
  const { mutate } = useSWRConfig();

  const acceptProposal = async (propostaId: number) => {
    await proposalsService.aceitar(pedidoId, propostaId);
    await Promise.allSettled([
      mutate(ENDPOINTS.PROPOSTAS(pedidoId)),
      mutate(`order-${pedidoId}`),
    ]);
    onSuccess?.();
  };

  const rejectProposal = async (propostaId: number) => {
    await proposalsService.recusar(pedidoId, propostaId);
    await Promise.allSettled([
      mutate(ENDPOINTS.PROPOSTAS(pedidoId)),
      mutate(`order-${pedidoId}`),
    ]);
    onSuccess?.();
  };

  return { acceptProposal, rejectProposal };
}