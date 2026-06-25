import { useColorScheme as useSystemColorScheme } from "react-native";
import { useThemeStore } from "@/store/themeStore";

export function useColorScheme(): "light" | "dark" {
  const systemScheme = useSystemColorScheme();
  const mode = useThemeStore((s) => s.mode);

  if (mode === "system") {
    return systemScheme ?? "light";
  }
  return mode;
}
