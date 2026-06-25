import React from "react";
import { View,
  Text,StyleSheet,
  FlatList, Pressable } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  FILTRO_OPTIONS,
  type FiltroConversaStatus,
} from "../types";

interface FilterTabsProps {
  selected: FiltroConversaStatus;
  onSelect: (value: FiltroConversaStatus) => void;
}

export default function FilterTabs({ selected, onSelect }: FilterTabsProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        horizontal
        data={FILTRO_OPTIONS}
        keyExtractor={(opt) => opt.value}
        renderItem={({ item: opt }) => {
          const isActive = opt.value === selected;
          return (
            <Pressable
              style={[
                styles.chip,
                isActive
                  ? styles.chipActive
                  : [
                      styles.chipInactive,
                      { backgroundColor: colors.background, borderColor: colors.border },
                    ],
              ]}
              onPress={() => onSelect(opt.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive
                    ? styles.chipTextActive
                    : [styles.chipTextInactive, { color: colors.textSecondary }],
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 51,
    justifyContent: "center",
  },
  scroll: {
    paddingHorizontal: 16,
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
  chipInactive: {},
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
