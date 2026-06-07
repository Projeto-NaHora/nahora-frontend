// features/professional/historico/hooks/useEarningsHistory.ts
import useSWR from "swr";
import { useCallback, useState } from "react";
import { historicoService } from "../service";
import type { GanhosMensaisResponse, ServicoHistoricoResponse } from "../types";

const NOW = new Date();

export const ganhosKeys = {
  all: ["historico", "ganhos"] as const,
  ganhos: (mes: number, ano: number) =>
    [...ganhosKeys.all, "ganhos", mes, ano] as const,
  servicos: (mes: number, ano: number) =>
    [...ganhosKeys.all, "servicos", mes, ano] as const,
};

export function useEarningsHistory() {
  const [mesAtual, setMesAtual] = useState(NOW.getMonth() + 1);
  const [anoAtual, setAnoAtual] = useState(NOW.getFullYear());

  const {
    data: ganhos,
    isLoading: isLoadingGanhos,
    error: errorGanhos,
  } = useSWR<GanhosMensaisResponse>(
    ganhosKeys.ganhos(mesAtual, anoAtual),
    () => historicoService.buscarGanhos(mesAtual, anoAtual),
    { revalidateOnFocus: false },
  );

  const {
    data: servicos,
    isLoading: isLoadingServicos,
    error: errorServicos,
  } = useSWR<ServicoHistoricoResponse[]>(
    ganhosKeys.servicos(mesAtual, anoAtual),
    () => historicoService.buscarServicos(mesAtual, anoAtual),
    { revalidateOnFocus: false },
  );

  const irParaMesAnterior = useCallback(() => {
    setMesAtual((prev) => {
      if (prev === 1) {
        setAnoAtual((ano) => ano - 1);
        return 12;
      }
      return prev - 1;
    });
  }, []);

  const irParaMesProximo = useCallback(() => {
    setMesAtual((prev) => {
      if (prev === 12) {
        setAnoAtual((ano) => ano + 1);
        return 1;
      }
      return prev + 1;
    });
  }, []);

  const isCurrentMonth =
    mesAtual === NOW.getMonth() + 1 && anoAtual === NOW.getFullYear();

  return {
    ganhos,
    servicos,
    isLoading: isLoadingGanhos || isLoadingServicos,
    error: errorGanhos || errorServicos,
    mesAtual,
    anoAtual,
    irParaMesAnterior,
    irParaMesProximo,
    isCurrentMonth,
  };
}
