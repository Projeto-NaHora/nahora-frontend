// app/(client)/(orders)/index.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import OrdersHeader from "@/features/orders/components/OrdersHeader";
import OrdersListContent from "@/features/orders/components/OrdersListContent";

export default function OrdersScreen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={[]}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <OrdersHeader />
        <OrdersListContent />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
