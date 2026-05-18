import { ENDPOINTS } from "@/services/api/endpoints";
import useSWR from "swr";
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

export function useProposalDetail(id: number) {
  const { data, error, isLoading } = useSWR(
    id ? ENDPOINTS.PROPOSTA(id) : null,
    () => proposalsService.buscarPorId(id)
  );

  return {
    proposal: data,
    isLoading,
    isError: !!error,
  };
}

export function useProposalActions(onSuccess?: () => void) {
  const acceptProposal = async (propostaId: number) => {
    await proposalsService.aceitar(propostaId);
    onSuccess?.();
  };

  const rejectProposal = async (propostaId: number) => {
    await proposalsService.recusar(propostaId);
    onSuccess?.();
  };

  return { acceptProposal, rejectProposal };
}