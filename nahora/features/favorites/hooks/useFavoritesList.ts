// features/favorites/hooks/useFavoritesList.ts
import useSWR from "swr";
import { favoritesService } from "../service";
import type { FavoritoResponseDTO } from "../types";

const favoritesListKeys = {
  all: "favorites-list",
  filtered: (categoriaId?: number) =>
    categoriaId ? `favorites-list-${categoriaId}` : "favorites-list",
} as const;

export function useFavoritesList(categoriaId?: number) {
  const key = favoritesListKeys.filtered(categoriaId);

  const { data, isLoading, error, mutate } = useSWR(key, () =>
    favoritesService.listar(categoriaId),
  );

  console.debug("[DEBUG-fav] SWR key:", key, "loading:", isLoading, "error:", !!error);
  if (data) {
    console.debug("[DEBUG-fav] SWR data — content.length:", data.content?.length, "totalElements:", data.totalElements, "empty:", data.empty);
  }
  if (error) {
    console.debug("[DEBUG-fav] SWR error:", (error as any)?.message, (error as any)?.response?.status);
  }

  return {
    favorites: (data?.content ?? []) as FavoritoResponseDTO[],
    totalElements: data?.totalElements ?? 0,
    isLoading,
    error,
    mutate,
  };
}
