// features/favorites/hooks/useFavoriteStatus.ts
import useSWR, { mutate as globalMutate } from "swr";
import { useCallback, useState } from "react";
import { favoritesService } from "../service";
import { getApiErrorMessage } from "@/utils/apiError";

interface UseFavoriteStatusReturn {
  isFavorite: boolean | undefined;
  isLoading: boolean;
  toggle: () => Promise<void>;
  snackbar: { visible: boolean; message: string; isError: boolean };
  dismissSnackbar: () => void;
}

export function useFavoriteStatus(profissionalId: number): UseFavoriteStatusReturn {
  const key = profissionalId ? `favorito-${profissionalId}` : null;

  const {
    data: isFavorite,
    mutate,
    isLoading,
  } = useSWR<boolean>(
    key,
    () => favoritesService.getStatus(profissionalId),
  );

  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    message: string;
    isError: boolean;
  }>({ visible: false, message: "", isError: false });

  const dismissSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, visible: false }));
  }, []);

  const toggle = useCallback(async () => {
    if (!profissionalId) return;

    const currentStatus = isFavorite ?? false;
    const nextStatus = !currentStatus;

    // Atualização otimista
    mutate(nextStatus, false);

    try {
      if (currentStatus) {
        await favoritesService.desfavoritar(profissionalId);
        setSnackbar({
          visible: true,
          message: "Profissional removido dos favoritos.",
          isError: false,
        });
      } else {
        await favoritesService.favoritar(profissionalId);
        setSnackbar({
          visible: true,
          message: "Profissional adicionado aos favoritos.",
          isError: false,
        });
      }
      // Revalida do servidor
      await mutate();

      // Invalida o cache da lista de favoritos para que a aba reflita
      // a mudança imediatamente (cobre `"favorites-list"` e variantes com categoriaId)
      await globalMutate(
        (key) => typeof key === "string" && key.startsWith("favorites-list"),
        undefined,
        { revalidate: true },
      );
    } catch (error) {
      // Reverte estado otimista
      mutate(currentStatus, false);
      setSnackbar({
        visible: true,
        message: getApiErrorMessage(error, "Erro ao atualizar favorito"),
        isError: true,
      });
    }
  }, [profissionalId, isFavorite, mutate]);

  return { isFavorite, isLoading, toggle, snackbar, dismissSnackbar };
}
