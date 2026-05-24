// features/professional/components/StatsCards.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Dados mockados — geolocalização, avaliação e renda mensal não implementados
export function StatsCards() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>3</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Na área</Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.value, styles.valueAccent]}>4.9</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Avaliação</Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>R$960</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Este mês</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  value: {
    fontSize: 22,
    fontFamily: "Inter",
    fontWeight: "700",
  },
  valueAccent: {
    color: "#E66A20",
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    marginTop: 2,
  },
});
