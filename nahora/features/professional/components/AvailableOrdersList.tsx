// features/professional/components/AvailableOrdersList.tsx
import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  usePedidosDisponiveis,
} from "../hooks/usePedidosDisponiveis";
import { getApiErrorMessage } from "@/utils/apiError";
import { AvailableOrderCard } from "./AvailableOrderCard";
import { ProfessionalFilters } from "./ProfessionalFilters";
import type {
  PedidoDisponivel,
  CategoriaFilter,
  UrgenciaFilter,
  PedidoFiltroParams,
} from "../types";

interface AvailableOrdersListProps {
  onPressPedido?: (pedido: PedidoDisponivel) => void;
}

export function AvailableOrdersList({ onPressPedido }: AvailableOrdersListProps) {
  const insets = useSafeAreaInsets();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [categoriaFilter, setCategoriaFilter] =
    useState<CategoriaFilter>("TODAS");
  const [urgenciaFilter, setUrgenciaFilter] = useState<UrgenciaFilter>("TODAS");
  const [refreshing, setRefreshing] = useState(false);

  const filtro: PedidoFiltroParams = useMemo(() => {
    const params: PedidoFiltroParams = {};
    if (categoriaFilter !== "TODAS") params.categoria = categoriaFilter;
    if (urgenciaFilter !== "TODAS") params.urgente = urgenciaFilter === "URGENTE";
    return params;
  }, [categoriaFilter, urgenciaFilter]);

  const {
    pedidos,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
  } = usePedidosDisponiveis(filtro);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (error && pedidos.length === 0) {
    const message = getApiErrorMessage(error, "Erro ao carregar pedidos");
    return (
      <View style={styles.centered}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          {message}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40 + insets.bottom,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={
          <View>
            <ProfessionalFilters
              selectedCategoria={categoriaFilter}
              onSelectCategoria={setCategoriaFilter}
              selectedUrgencia={urgenciaFilter}
              onSelectUrgencia={setUrgenciaFilter}
            />
            <View style={styles.headingRow}>
              <Text style={[styles.heading, { color: colors.textPrimary }]}>
                Pedidos disponíveis
              </Text>
              <Text style={[styles.location, { color: colors.textSecondary }]}>
                Recife, PE
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={colors.brand} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Nenhum pedido disponível no momento.
          </Text>
        }
        renderItem={({ item }) => (
          <AvailableOrderCard
            pedido={item}
            onPress={(pedido) => onPressPedido?.(pedido)}
          />
        )}
      />
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
    textAlign: "center",
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 8,
    paddingBottom: 4,
  },
  heading: {
    fontSize: 22,
    fontFamily: "Inter",
    fontWeight: "700",
  },
  location: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    paddingBottom: 2,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    textAlign: "center",
    paddingVertical: 24,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
