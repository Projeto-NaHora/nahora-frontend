import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

  const handlePressPedido = (pedido: PedidoDisponivel) => {
    router.push(`/(professional)/(orders)/${pedido.id}`);
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, { backgroundColor: colors.brand }]}
    >
      <ProfessionalHeader />
      <StatsCards />
      <AvailableOrdersList onPressPedido={handlePressPedido} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
