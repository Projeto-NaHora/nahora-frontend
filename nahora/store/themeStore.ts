// store/themeStore.ts
// Zustand store for user theme preference (light / dark / system)

import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const THEME_KEY = "nahora-theme-mode";

export type ThemeMode = "light" | "dark" | "system";

function loadMode(): ThemeMode {
  try {
    const stored = SecureStore.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // ignore
  }
  return "system";
}

function saveMode(mode: ThemeMode) {
  try {
    SecureStore.setItem(THEME_KEY, mode);
  } catch {
    // ignore
  }
}

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  mode: loadMode(),
  setMode: (mode: ThemeMode) => {
    saveMode(mode);
    set({ mode });
  },
}));
