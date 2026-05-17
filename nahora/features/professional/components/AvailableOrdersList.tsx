// features/professional/components/AvailableOrdersList.tsx
import React, { useMemo, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePedidosDisponiveis, enrichWithMockData } from "../hooks/usePedidosDisponiveis";
import { getApiErrorMessage } from "@/utils/apiError";
import { AvailableOrderCard } from "./AvailableOrderCard";
import { ProfessionalFilters } from "./ProfessionalFilters";
import type { PedidoDisponivel, CategoriaFilter, UrgenciaFilter } from "../types";

export function AvailableOrdersList() {
  const insets = useSafeAreaInsets();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [page, setPage] = useState(0);
  const { data, isLoading, error, mutate } = usePedidosDisponiveis(page);
  const [categoriaFilter, setCategoriaFilter] = useState<CategoriaFilter>("TODAS");
  const [urgenciaFilter, setUrgenciaFilter] = useState<UrgenciaFilter>("TODAS");
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const pedidosResumo = data?.content;
  const totalPages = data?.totalPages ?? 0;
  const hasMore = page < totalPages - 1;

  const enriched = useMemo(() => enrichWithMockData(pedidosResumo), [pedidosResumo]);

  const filtered = useMemo(() => {
    let result = enriched;
    if (categoriaFilter !== "TODAS") {
      result = result.filter((p) => p.categoria === categoriaFilter);
    }
    if (urgenciaFilter !== "TODAS") {
      result = result.filter((p) =>
        urgenciaFilter === "URGENTE" ? p.urgente : !p.urgente,
      );
    }
    return result;
  }, [enriched, categoriaFilter, urgenciaFilter]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(0);
    await mutate();
    setRefreshing(false);
  }, [mutate]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loadingMore || isLoading) return;
    setLoadingMore(true);
    setPage((prev) => prev + 1);
    await mutate();
    setLoadingMore(false);
  }, [hasMore, loadingMore, isLoading, mutate]);

  if (isLoading && !data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (error && !data) {
    const message = getApiErrorMessage(error, "Erro ao carregar pedidos");
    return (
      <View style={styles.centered}>
        <Text style={[styles.errorText, { color: colors.error }]}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40 + insets.bottom,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
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
              <Text style={[styles.heading, { color: colors.textPrimary }]}>Pedidos disponíveis</Text>
              <Text style={[styles.location, { color: colors.textSecondary }]}>Recife, PE</Text>
            </View>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
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
            onPress={(_pedido: PedidoDisponivel) => {
              // Navegação futura: detalhes do pedido
            }}
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
