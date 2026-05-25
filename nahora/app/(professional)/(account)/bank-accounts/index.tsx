import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { Colors, FontSizes } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function Screen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        Contas Bancárias e PIX
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: FontSizes.body,
  },
});
