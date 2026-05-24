// features/orders/components/OrdersHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function OrdersHeader() {
  const insets = useSafeAreaInsets();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const handleNewOrder = () => {
    router.push("/(client)/(orders)/new");
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          paddingBottom: 16,
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Meus Pedidos
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.7}
        onPress={handleNewOrder}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingRight: 24.02,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "700",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F26F21",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "300",
    lineHeight: 26,
  },
});
