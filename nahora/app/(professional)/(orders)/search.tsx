import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { OrdersHeader } from "@/features/professional/components/OrdersHeader";
import { AvailableOrderCard } from "@/features/professional/components/AvailableOrderCard";
import { ProfessionalFilters } from "@/features/professional/components/ProfessionalFilters";
import { usePedidosDisponiveis } from "@/features/professional/hooks/usePedidosDisponiveis";
import { getApiErrorMessage } from "@/utils/apiError";
import type {
  PedidoDisponivel,
  CategoriaFilter,
  UrgenciaFilter,
  PedidoFiltroParams,
} from "@/features/professional/types";

export default function SearchScreen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] =
    useState<CategoriaFilter>("TODAS");
  const [urgenciaFilter, setUrgenciaFilter] =
    useState<UrgenciaFilter>("TODAS");

  const filtro: PedidoFiltroParams = useMemo(() => {
    const params: PedidoFiltroParams = {};
    if (searchTerm.trim().length >= 2) params.termo = searchTerm.trim();
    if (categoriaFilter !== "TODAS") params.categoria = categoriaFilter;
    if (urgenciaFilter !== "TODAS")
      params.urgente = urgenciaFilter === "URGENTE";
    return params;
  }, [categoriaFilter, urgenciaFilter, searchTerm]);

  const {
    pedidos,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
  } = usePedidosDisponiveis(filtro);

  const handleSearch = useCallback((termo: string) => {
    setSearchTerm(termo);
  }, []);

  const handlePressPedido = useCallback(
    (pedido: PedidoDisponivel) => {
      router.push(`/(professional)/(orders)/${pedido.id}`);
    },
    [router],
  );

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, { backgroundColor: colors.brand }]}
    >
      <OrdersHeader
        searchMode
        initialSearch={searchTerm}
        onSearch={handleSearch}
      />

      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <ProfessionalFilters
          selectedCategoria={categoriaFilter}
          onSelectCategoria={setCategoriaFilter}
          selectedUrgencia={urgenciaFilter}
          onSelectUrgencia={setUrgenciaFilter}
        />

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.brand} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Buscando pedidos...
            </Text>
          </View>
        ) : error && pedidos.length === 0 ? (
          <View style={styles.centered}>
            <Text style={[styles.errorText, { color: colors.error }]}>
              {getApiErrorMessage(error, "Erro ao buscar pedidos")}
            </Text>
          </View>
        ) : (
          <FlatList
            data={pedidos}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            refreshing={false}
            onRefresh={refresh}
            ListHeaderComponent={
              <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                {pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""} encontrado{pedidos.length !== 1 ? "s" : ""}
              </Text>
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
                Nenhum pedido encontrado para "{searchTerm}".
              </Text>
            }
            renderItem={({ item }) => (
              <AvailableOrderCard
                pedido={item}
                onPress={(p) => handlePressPedido(p)}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16,
    paddingHorizontal: 0,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "400",
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "600",
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  resultCount: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "500",
    marginBottom: 8,
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
