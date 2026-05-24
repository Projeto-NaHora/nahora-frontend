import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  FILTRO_OPTIONS,
  type FiltroConversaStatus,
} from "../types";

interface FilterTabsProps {
  selected: FiltroConversaStatus;
  onSelect: (value: FiltroConversaStatus) => void;
}

export default function FilterTabs({ selected, onSelect }: FilterTabsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {FILTRO_OPTIONS.map((opt) => {
          const isActive = opt.value === selected;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.chip,
                isActive ? styles.chipActive : styles.chipInactive,
              ]}
              activeOpacity={0.7}
              onPress={() => onSelect(opt.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive ? styles.chipTextActive : styles.chipTextInactive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
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
  chipInactive: {
    borderColor: "#D9D9D9",
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
    color: "#9CA3AF",
  },
});
