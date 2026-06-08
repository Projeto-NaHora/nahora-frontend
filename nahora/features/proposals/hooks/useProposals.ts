import { ENDPOINTS } from "@/services/api/endpoints";
import useSWR, { useSWRConfig } from "swr";
import { proposalsService } from "../service";
import type { Proposta } from "../types";

export function useProposalsByPedido(pedidoId: number) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    pedidoId ? ENDPOINTS.PROPOSTAS(pedidoId) : null,
    () => proposalsService.listarPorPedido(pedidoId)
  );

  return {
    proposals: data ?? [],
    isLoading,
    isValidating,
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
    // Optimistic: immediately mark the accepted proposal in cache so the
    // payment screen sees it even before any background revalidation.
    // NOTE: we intentionally do NOT revalidate the proposals list here —
    // the optimistic update is the source of truth (the API just confirmed
    // the acceptance). A background revalidation could return stale data
    // if the server has a replication delay, overwriting the correct state.
    mutate(
      ENDPOINTS.PROPOSTAS(pedidoId),
      (cached: Proposta[] | undefined) =>
        cached?.map((p) =>
          p.id === propostaId ? { ...p, status: "ACEITA" as const } : p,
        ),
      { revalidate: false },
    ).catch(() => {});
    // Revalidate the order (status changed to AGUARDANDO_PAGAMENTO)
    // but don't block navigation on it.
    mutate(`order-${pedidoId}`).catch(() => {});
    onSuccess?.();
  };

  const rejectProposal = async (propostaId: number) => {
    await proposalsService.recusar(pedidoId, propostaId);
    // Optimistic: immediately mark the rejected proposal in cache.
    mutate(
      ENDPOINTS.PROPOSTAS(pedidoId),
      (cached: Proposta[] | undefined) =>
        cached?.map((p) =>
          p.id === propostaId ? { ...p, status: "REJEITADA" as const } : p,
        ),
      { revalidate: false },
    ).catch(() => {});
    // Revalidate the order in background (don't block navigation).
    mutate(`order-${pedidoId}`).catch(() => {});
    onSuccess?.();
  };

  return { acceptProposal, rejectProposal };
}