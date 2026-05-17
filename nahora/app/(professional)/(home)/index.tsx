import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ProfessionalHeader } from "@/features/professional/components/ProfessionalHeader";
import { StatsCards } from "@/features/professional/components/StatsCards";
import { AvailableOrdersList } from "@/features/professional/components/AvailableOrdersList";

export default function Screen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ProfessionalHeader />
      <StatsCards />
      <AvailableOrdersList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
