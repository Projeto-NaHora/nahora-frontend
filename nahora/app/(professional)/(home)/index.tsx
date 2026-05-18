import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ProfessionalHeader } from "@/features/professional/components/ProfessionalHeader";
import { StatsCards } from "@/features/professional/components/StatsCards";
import { AvailableOrdersList } from "@/features/professional/components/AvailableOrdersList";
import type { PedidoDisponivel } from "@/features/professional/types";

export default function Screen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const router = useRouter();

  const handlePressPedido = useCallback(
    (pedido: PedidoDisponivel) => {
      router.push(`/(professional)/(orders)/${pedido.id}`);
    },
    [router],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ProfessionalHeader />
      <StatsCards />
      <AvailableOrdersList onPressPedido={handlePressPedido} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
