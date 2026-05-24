import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import type { ProfileMenuItem } from "../types";

interface MenuItemProps {
  item: ProfileMenuItem;
  onPress: (item: ProfileMenuItem) => void;
}

export function MenuItem({ item, onPress }: MenuItemProps) {
  const isDanger = item.isDanger;
  const labelColor = isDanger ? "#fb2c36" : "#1c1c1ee5";

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, { color: labelColor }]}>{item.label}</Text>
      <View style={styles.chevron}>
        <IconSymbol
          name="chevron.right"
          size={18}
          color="#8e8e9366"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: 17,
    fontFamily: Fonts?.sans,
    fontWeight: "400",
    lineHeight: 21.25,
  },
  chevron: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
