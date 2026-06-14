// features/settings/hooks/useSettingsPreferences.ts
import { useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";
import { settingsService } from "../service";
import { getApiErrorMessage } from "@/utils/apiError";
import type { UpdatePreferencesPayload } from "../types";

export const settingsKeys = {
  preferences: "settings-preferences",
} as const;

export function useSettingsPreferences() {
  const { mutate: globalMutate } = useSWRConfig();
  const swr = useSWR(settingsKeys.preferences, () =>
    settingsService.buscarPreferencias(),
  );

  /**
   * Optimistic update for a single preference toggle.
   *
   * Reverts on error and returns the error message (or null on success)
   * so the screen can show a snackbar.
   */
  const updatePreference = useCallback(
    async (payload: UpdatePreferencesPayload): Promise<string | null> => {
      // Snapshot current data to revert on failure
      const previous = swr.data;

      // Optimistic update
      await globalMutate(
        settingsKeys.preferences,
        { ...previous, ...payload } as typeof previous,
        false,
      );

      try {
        await settingsService.atualizarPreferencias(payload);
        // Revalidate to keep in sync with server
        swr.mutate();
        return null;
      } catch (err) {
        // Revert on error
        globalMutate(settingsKeys.preferences, previous, false);
        return getApiErrorMessage(err, "Erro ao atualizar preferências");
      }
    },
    [swr, globalMutate],
  );

  return { ...swr, updatePreference };
}
