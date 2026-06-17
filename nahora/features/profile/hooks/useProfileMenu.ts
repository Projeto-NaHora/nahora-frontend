import { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import useSWR from "swr";

import { useAuthStore } from "@/store/authStore";
import { useProfessionalProfile } from "./useProfile";
import { profileService } from "../service";
import type {
  ProfileMenuItem,
  ProfileStats,
  HistoricoProfissionalResumoResponse,
} from "../types";

function mapProfissao(profissao?: string): string {
  if (!profissao) return "";
  const map: Record<string, string> = {
    ELETRICA: "Eletricista",
    ENCANAMENTO: "Encanador",
    PINTURA: "Pintor",
    PEDREIRO: "Pedreiro",
    AR_CONDICIONADO: "Ar-condicionado",
  };
  return map[profissao] ?? profissao;
}

function formatCurrency(value: string | undefined | null): string {
  if (value == null || value === "") return "R$ 0";
  const num = Number(value);
  if (Number.isNaN(num)) return "R$ 0";
  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function useProfileMenu() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    mutate: retry,
  } = useProfessionalProfile();

  const {
    data: resumo,
    isLoading: resumoLoading,
    error: resumoError,
  } = useSWR<HistoricoProfissionalResumoResponse>(
    "historico-profissional-resumo",
    () => profileService.buscarResumoProfissional(),
  );

  const isLoading = profileLoading || resumoLoading;
  const error = profileError || resumoError;

  // Deriva os dados de exibição
  const nome = profile?.nome ?? user?.nome ?? "";
  const initials = useMemo(() => {
    return nome
      ? nome
          .split(" ")
          .map((n) => n[0])
          .filter((_, i, arr) => i === 0 || i === arr.length - 1)
          .join("")
          .toUpperCase()
      : "??";
  }, [nome]);

  const subtitle = useMemo(() => {
    if (profile) {
      const profissao = mapProfissao(profile.profissao);
      if (profile.cidade && profile.estado) {
        return `${profissao} · ${profile.cidade}, ${profile.estado}`;
      }
      return profissao;
    }
    return "";
  }, [profile]);

  const stats: ProfileStats = useMemo(
    () => ({
      servicesCount: resumo?.totalServicos ?? profile?.totalServicosExecutados ?? 0,
      rating: profile?.notaMedia ?? 0,
      earnings: formatCurrency(resumo?.totalRecebido),
    }),
    [profile, resumo],
  );

  const menuItems: ProfileMenuItem[] = useMemo(
    () => [
      {
        id: "edit-profile",
        label: "Editar perfil",
        route: "/(professional)/(account)/public-profile-1",
      },
      {
        id: "bank-accounts",
        label: "Contas Bancárias e PIX",
        route: "/(professional)/(account)/bank-accounts",
      },
      {
        id: "addresses",
        label: "Endereços salvos",
        route: "/(professional)/(account)/addresses",
      },
      {
        id: "settings",
        label: "Configurações",
        route: "/(professional)/(account)/settings",
      },
      {
        id: "earnings",
        label: "Meus Ganhos",
        route: "/(professional)/(account)/earnings",
      },
      {
        id: "privacy",
        label: "Privacidade",
        route: "/(professional)/(account)/settings/privacy",
      },
    ],
    [],
  );

  const handleMenuItemPress = useCallback(
    (item: ProfileMenuItem) => {
      if (item.route) {
        router.push(item.route as any);
      }
    },
    [router],
  );

  // Popup de confirmação de logout
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const openLogoutPopup = useCallback(() => {
    setShowLogoutPopup(true);
  }, []);

  const closeLogoutPopup = useCallback(() => {
    setShowLogoutPopup(false);
  }, []);

  const confirmLogout = useCallback(() => {
    setShowLogoutPopup(false);
    logout();
    router.replace("/(auth)/(login)");
  }, [logout, router]);

  return {
    user,
    isLoading,
    error,
    retry,
    nome,
    initials,
    subtitle,
    stats,
    menuItems,
    handleMenuItemPress,
    showLogoutPopup,
    openLogoutPopup,
    closeLogoutPopup,
    confirmLogout,
  };
}
