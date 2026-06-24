import { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import useSWR from "swr";

import { useAuthStore } from "@/store/authStore";
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type {
  ProfileMenuItem,
  ProfileStats,
  HistoricoResumoResponse,
} from "../types";

function formatCurrency(value: number | undefined | null): string {
  if (value == null) return "R$ 0";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function useClientProfileMenu() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const {
    data: resumo,
    isLoading,
    error,
    mutate: retry,
  } = useSWR<HistoricoResumoResponse>(
    ENDPOINTS.HISTORICO_RESUMO,
    async (url: string) => {
      const { data } = await api.get<HistoricoResumoResponse>(url);
      return data;
    },
  );

  const nome = user?.nome ?? "";
  const initials = (() => {
    return nome
      ? nome
          .split(" ")
          .map((n) => n[0])
          .filter((_, i, arr) => i === 0 || i === arr.length - 1)
          .join("")
          .toUpperCase()
      : "??";
  })();

  const subtitle = "Cliente";

  const stats: ProfileStats = (() => ({
    servicesCount: resumo?.totalServicos ?? 0,
    rating: resumo?.mediaAvaliacoes ?? 0,
    earnings: formatCurrency(resumo?.totalPago),
  }))();

  const menuItems: ProfileMenuItem[] = (() => [
    {
      id: "edit-profile",
      label: "Editar perfil",
      route: "/(client)/(account)/edit",
    },
    {
      id: "history",
      label: "Histórico",
      route: "/(client)/(account)/history",
    },
    {
      id: "addresses",
      label: "Endereços salvos",
      route: "/(client)/(account)/addresses",
    },
    {
      id: "payment-methods",
      label: "Formas de pagamento",
      route: "/(client)/(account)/payment-methods",
    },
    {
      id: "settings",
      label: "Configurações",
      route: "/(client)/(account)/settings",
    },
    {
      id: "privacy",
      label: "Privacidade",
      route: "/(client)/(account)/settings/privacy",
    },
  ])();

  const handleMenuItemPress = (item: ProfileMenuItem) => {
    if (item.route) {
      router.push(item.route as any);
    }
  };

  // Popup de confirmação de logout
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const openLogoutPopup = () => {
    setShowLogoutPopup(true);
  };

  const closeLogoutPopup = () => {
    setShowLogoutPopup(false);
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false);
    logout();
    router.replace("/(auth)/(login)");
  };

  return {
    user,
    isLoading,
    error,
    initials,
    subtitle,
    stats,
    menuItems,
    handleMenuItemPress,
    showLogoutPopup,
    openLogoutPopup,
    closeLogoutPopup,
    confirmLogout,
    retry,
  };
}
