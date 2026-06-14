// features/notifications/hooks/useNotifications.ts
import { useCallback, useMemo } from "react";
import useSWR, { mutate } from "swr";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

import { notificationService } from "../service";
import type { NotificacaoDTO, NotificacoesAgrupadas } from "../types";
import { useNotifStore } from "@/store/notifStore";
import { getApiErrorMessage } from "@/utils/apiError";

export const notificationKeys = {
  all: "notifications",
} as const;

function groupByTime(notificacoes: NotificacaoDTO[]): NotificacoesAgrupadas[] {
  const agora = new Date();
  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const inicioOntem = new Date(inicioHoje.getTime() - 86400000);
  const inicioSemana = new Date(inicioHoje.getTime() - inicioHoje.getDay() * 86400000);
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

  const grupos: Record<string, NotificacaoDTO[]> = {
    "Hoje": [],
    "Ontem": [],
    "Esta Semana": [],
    "Este Mês": [],
    "Anteriores": [],
  };

  for (const n of notificacoes) {
    const data = new Date(n.criadaEm);
    if (data >= inicioHoje) grupos["Hoje"].push(n);
    else if (data >= inicioOntem) grupos["Ontem"].push(n);
    else if (data >= inicioSemana) grupos["Esta Semana"].push(n);
    else if (data >= inicioMes) grupos["Este Mês"].push(n);
    else grupos["Anteriores"].push(n);
  }

  return Object.entries(grupos)
    .filter(([, items]) => items.length > 0)
    .map(([secao, notificacoes]) => ({ secao, notificacoes }));
}

export function useNotifications() {
  const router = useRouter();

  const {
    data: notificacoes,
    isLoading,
    error,
  } = useSWR(notificationKeys.all, () => notificationService.listar());

  const agrupadas: NotificacoesAgrupadas[] = useMemo(
    () => (notificacoes ? groupByTime(notificacoes) : []),
    [notificacoes],
  );

  const unreadCount = useMemo(
    () => notificacoes?.filter((n) => !n.lida).length ?? 0,
    [notificacoes],
  );

  const handlePress = useCallback(
    async (notificacao: NotificacaoDTO) => {
      if (!notificacao.lida) {
        await notificationService.marcarLida(notificacao.id);
        mutate(notificationKeys.all);
        useNotifStore.getState().decrement();
      }

      const d = notificacao.dados;
      if (!d) return;

      if (d.conversaId) {
        router.push(`/(client)/(chats)/${d.conversaId}` as any);
      } else if (d.pedidoId) {
        router.push(`/(client)/(orders)/${d.pedidoId}` as any);
      } else if (d.profissionalId) {
        router.push(`/(client)/(home)/${d.profissionalId}` as any);
      }
    },
    [router],
  );

  const handleClearAll = useCallback(async () => {
    try {
      await notificationService.limparTodas();
      mutate(notificationKeys.all, []);
      useNotifStore.getState().clear();
    } catch {
      Alert.alert("Erro", getApiErrorMessage(null, "Não foi possível limpar as notificações."));
    }
  }, []);

  return {
    notificacoes,
    agrupadas,
    isLoading,
    error,
    unreadCount,
    handlePress,
    handleClearAll,
  };
}