import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PropostasListContent from "@/features/proposals/components/PropostasListContent";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function PropostasScreen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={[]}>
      <PropostasListContent />
    </SafeAreaView>
  );
}
