import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  const [categoriaFilter, setCategoriaFilter] =
    useState<CategoriaFilter>("TODAS");
  const [urgenciaFilter, setUrgenciaFilter] =
    useState<UrgenciaFilter>("TODAS");

  const filtro: PedidoFiltroParams = (() => {
    const params: PedidoFiltroParams = {};
    if (debouncedSearchTerm.trim().length >= 2) params.termo = debouncedSearchTerm.trim();
    if (categoriaFilter !== "TODAS") params.categoria = categoriaFilter;
    if (urgenciaFilter !== "TODAS")
      params.urgente = urgenciaFilter === "URGENTE";
    return params;
  })();

  const {
    pedidos,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
  } = usePedidosDisponiveis(filtro);

  const handleSearch = (termo: string) => {
    setSearchTerm(termo);
  };

  const handlePressPedido = (pedido: PedidoDisponivel) => {
    router.push(`/(professional)/(orders)/${pedido.id}`);
  };

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
        <View style={{ paddingLeft: 16 }}>
          <ProfessionalFilters 
            selectedCategoria={categoriaFilter}
            onSelectCategoria={setCategoriaFilter}
            selectedUrgencia={urgenciaFilter}
            onSelectUrgencia={setUrgenciaFilter}
          />
        </View>

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
