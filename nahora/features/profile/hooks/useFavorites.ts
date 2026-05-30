import useSWR, { mutate } from "swr";
import { profileService } from "../service";
import { getApiErrorMessage } from "@/utils/apiError";
import type { FavoriteProfessional } from "../types";

export const favoritesKeys = {
  all: "favorites",
} as const;

export function useFavorites() {
  return useSWR(favoritesKeys.all, () => profileService.buscarFavoritos());
}

/** Verifica se um profissional específico está nos favoritos */
export function useIsFavorited(professionalId: number | undefined) {
  const { data } = useFavorites();
  const favorites: FavoriteProfessional[] = data ?? [];

  if (!professionalId) return false;
  return favorites.some((f) => f.id === professionalId);
}

export function useToggleFavorite() {
  const toggle = async (id: number, isFavorited: boolean) => {
    try {
      if (isFavorited) {
        await profileService.desfavoritar(id);
      } else {
        await profileService.favoritar(id);
      }
      // Revalida a lista de favoritos
      await mutate(favoritesKeys.all);
      return { success: true };
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) };
    }
  };

  return { toggle };
}
