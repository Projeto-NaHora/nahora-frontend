import { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";

import { useAuthStore } from "@/store/authStore";
import type {
  ProfileMenuItem,
  ProfileStats,
  ProfessionalProfileResponse,
} from "../types";

// ---- MOCK: remover quando o endpoint GET /profissionais/me estiver pronto ----
const MOCK_PROFILE: ProfessionalProfileResponse = {
  id: 1,
  nome: "Gustavo Henrique",
  email: "gustavo@email.com",
  telefone: "11999998888",
  categoriaServico: "PINTURA",
  cidade: "Recife",
  estado: "PE",
  mediaAvaliacao: 4.8,
  totalServicos: 21,
  ganhos: "R$ 3K",
};
// ---------------------------------------------------------------------------

function mapCategoriaServico(categoria: string): string {
  const map: Record<string, string> = {
    ELETRICA: "Eletricista",
    ENCANAMENTO: "Encanador",
    PINTURA: "Pintor",
    PEDREIRO: "Pedreiro",
    AR_CONDICIONADO: "Ar-condicionado",
  };
  return map[categoria] ?? categoria;
}

export function useProfileMenu() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // ---- MOCK: trocar useMockProfile() por useProfessionalProfile() quando a API estiver pronta ----
  const { profile, isLoading, error, retry } = useMockProfile();
  // const { data: profile, isLoading, error, mutate: retry } = useProfessionalProfile();

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
      const profissao = mapCategoriaServico(profile.categoriaServico);
      if (profile.cidade && profile.estado) {
        return `${profissao} · ${profile.cidade}, ${profile.estado}`;
      }
      return profissao;
    }
    return "";
  }, [profile]);

  const stats: ProfileStats = useMemo(
    () => ({
      servicesCount: profile?.totalServicos ?? 0,
      rating: profile?.mediaAvaliacao ?? 0,
      earnings: profile?.ganhos ?? "R$ 0",
    }),
    [profile],
  );

  const menuItems: ProfileMenuItem[] = useMemo(
    () => [
      {
        id: "edit-profile",
        label: "Editar perfil",
        route: "/(professional)/(account)/edit",
      },
      {
        id: "public-profile",
        label: "Editar perfil público",
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

/** Mock que simula o retorno de useProfessionalProfile enquanto a API não existe */
function useMockProfile() {
  // Simula um carregamento rápido, depois entrega os dados mockados
  const profile = MOCK_PROFILE;
  return {
    profile,
    isLoading: false,
    error: null,
    retry: () => {},
  };
}
