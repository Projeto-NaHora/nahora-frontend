// features/settings/hooks/useSettingsDisplay.ts
import { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { storage } from "@/utils/storage";
import type { DisplayMode } from "../types";

const DISPLAY_MODE_KEY = "displayMode";

export function useSettingsDisplay() {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<DisplayMode>("system");

  // Load persisted mode on mount
  useEffect(() => {
    storage.get(DISPLAY_MODE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setModeState(stored);
      }
    });
  }, []);

  const setMode = useCallback(async (newMode: DisplayMode) => {
    setModeState(newMode);
    await storage.set(DISPLAY_MODE_KEY, newMode);
  }, []);

  // Effective color scheme: respect system if mode === "system"
  const effectiveScheme = mode === "system" ? (systemScheme ?? "light") : mode;

  return { mode, setMode, effectiveScheme };
}
