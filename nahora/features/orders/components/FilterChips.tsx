// features/orders/components/FilterChips.tsx
import React from "react";
import { View,
  Text,StyleSheet,
  ScrollView, Pressable } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { FILTRO_OPTIONS, type FiltroStatus } from "../types";

interface FilterChipsProps {
  selected: FiltroStatus;
  onSelect: (value: FiltroStatus) => void;
}

export default function FilterChips({ selected, onSelect }: FilterChipsProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {FILTRO_OPTIONS.map((opt) => {
          const isActive = opt.value === selected;
          return (
            <Pressable
              key={opt.value}
              style={[
                styles.chip,
                isActive
                  ? { backgroundColor: colors.surfaceAccent, borderColor: colors.brand }
                  : [
                      styles.chipInactive,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                      },
                    ],
              ]}
              onPress={() => onSelect(opt.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive
                    ? styles.chipTextActive
                    : [
                        styles.chipTextInactive,
                        { color: colors.textSecondary },
                      ],
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 51,
    justifyContent: "center",
  },
  scroll: {
    paddingHorizontal: 0,
    gap: 8,
    alignItems: "center",
  },
  chip: {
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: "#FEF0E8",
    borderColor: "#F26F21",
  },
  chipInactive: {
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "700",
  },
  chipTextActive: {
    color: "#F26F21",
  },
  chipTextInactive: {
    fontWeight: "400",
  },
});
