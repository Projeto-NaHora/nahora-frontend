// features/orders/components/OrdersListContent.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useOrders } from "../hooks/useOrders";
import { getApiErrorMessage } from "@/utils/apiError";
import OrderCard from "./OrderCard";
import FilterChips from "./FilterChips";
import EmptyOrders from "./EmptyOrders";
import type { Pedido, FiltroStatus } from "../types";

export default function OrdersListContent() {
  const insets = useSafeAreaInsets();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [filtro, setFiltro] = useState<FiltroStatus>("TODOS");
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, isValidating, error, mutate } = useOrders({
    status: filtro,
  });

  const handleOrderPress = (pedido: Pedido) => {
    if (pedido.status === "AGUARDANDO_VALIDACAO") {
      router.push(`/(client)/(orders)/${pedido.id}/validation`);
    } else if (pedido.status === "EM_ANDAMENTO") {
      router.push(`/(client)/(orders)/${pedido.id}/active`);
    } else {
      router.push(`/(client)/(orders)/${pedido.id}`);
    }
  };

  const handleNewOrder = () => {
    router.push("/(client)/(orders)/new");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#F26F21" />
      </View>
    );
  }

  // Error state
  if (error) {
    const message = getApiErrorMessage(error, "Erro ao carregar pedidos");
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={styles.errorText}>{message}</Text>
        <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
          Puxe para tentar novamente
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data?.content ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 120 + insets.bottom,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <View>
            <FilterChips selected={filtro} onSelect={setFiltro} />
          </View>
        }
        ListEmptyComponent={<EmptyOrders />}
        renderItem={({ item }) => (
          <OrderCard pedido={item} onPress={handleOrderPress} />
        )}
      />

      {/* Botão flutuante "Novo pedido" */}
      <View style={[styles.fabContainer, { bottom: 16 + insets.bottom }]}>
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={handleNewOrder}
        >
          <View style={styles.fabIcon}>
            <Text style={styles.fabIconText}>+</Text>
          </View>
          <Text style={styles.fabText}>Novo pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    textAlign: "center",
  },
  fabContainer: {
    position: "absolute",
    left: 24,
    right: 24,
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F26F21",
    borderRadius: 32,
    height: 56,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  fabIcon: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  fabIconText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "300",
    lineHeight: 22,
  },
  fabText: {
    fontSize: 17,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
