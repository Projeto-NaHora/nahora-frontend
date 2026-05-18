// features/orders/components/EmptyOrders.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface EmptyOrdersProps {
  message?: string;
}

export default function EmptyOrders({
  message = "Nenhum pedido encontrado",
}: EmptyOrdersProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📋</Text>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "400",
    textAlign: "center",
  },
});
