import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Fonts } from "@/constants/theme";
import type { ProfileStats } from "../types";

interface StatsCardsProps {
  stats: ProfileStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.cardValueWrapper}>
          <Text style={[styles.cardValue, { color: colors.text }]}>
            {stats.servicesCount}
          </Text>
        </View>
        <Text style={styles.cardLabel}>Serviços</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardValueWrapper}>
          <Text style={[styles.cardValue, { color: colors.text }]}>
            {stats.rating}
          </Text>
        </View>
        <Text style={styles.cardLabel}>Avaliação</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardValueWrapper}>
          <Text style={[styles.cardValue, { color: colors.success }]}>
            {stats.earnings}
          </Text>
        </View>
        <Text style={styles.cardLabel}>Ganhos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cardValueWrapper: {
    paddingBottom: 6,
  },
  cardValue: {
    fontSize: 22,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
    lineHeight: 22,
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: Fonts?.sans,
    fontWeight: "400",
    lineHeight: 21,
  },
});
