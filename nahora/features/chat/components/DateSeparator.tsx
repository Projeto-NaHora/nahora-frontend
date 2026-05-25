import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useChatColors } from "@/hooks/use-chat-colors";
import { formatDateSeparator } from "@/utils/formatters";

interface Props {
  date: string;
}

export function DateSeparator({ date }: Props) {
  const colors = useChatColors();
  const label = formatDateSeparator(date);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.pill,
          {
            backgroundColor: colors.surfaceLight,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Text style={[styles.text, { color: colors.mutedText }]}>{label}</Text>
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
    borderWidth: 1,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1.2,
  },
});
