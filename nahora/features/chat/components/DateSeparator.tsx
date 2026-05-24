import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ChatColors } from "@/constants/theme";
import { formatDateSeparator } from "@/utils/formatters";

interface Props {
  date: string;
}

export function DateSeparator({ date }: Props) {
  const label = formatDateSeparator(date);

  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <Text style={styles.text}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 12,
  },
  pill: {
    backgroundColor: ChatColors.surfaceLight,
    borderWidth: 1,
    borderColor: ChatColors.borderSubtle,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 12,
    color: ChatColors.mutedText,
    letterSpacing: 1.2,
  },
});
