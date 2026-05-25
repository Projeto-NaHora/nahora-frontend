import { useMemo } from "react";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "./use-color-scheme";

export function useChatColors() {
  const theme = useColorScheme() ?? "light";
  return useMemo(() => Colors[theme].chat, [theme]);
}
