import React, { useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProposalsByPedido } from "@/features/proposals/hooks/useProposals";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { CATEGORIA_LABEL, STATUS_LABEL } from "@/features/orders/types";
import { PropostaCard } from "@/features/proposals/components/PropostaCard";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type OrdemFiltro = "todos" | "melhor_avaliacao" | "menor_preco";

function formatDateAndTime(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} · ${hours}:${mins}`;
}

const FILTRO_LABELS: { key: OrdemFiltro; label: string }[] = [
  { key: "melhor_avaliacao", label: "Melhor avaliação" },
  { key: "menor_preco", label: "Menor preço" },
];

export default function PropostasListContent() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [filtro, setFiltro] = useState<OrdemFiltro>("todos");
  const { proposals, isLoading, isError } = useProposalsByPedido(Number(orderId));
  const { data: order } = useOrderDetail(Number(orderId));

  const propostasOrdenadas = useMemo(() => {
    return [...proposals].sort((a, b) => {
      if (filtro === "menor_preco") return a.valor - b.valor;
      if (filtro === "melhor_avaliacao") return b.profissional.notaMedia - a.profissional.notaMedia;
      return 0;
    });
  }, [proposals, filtro]);

  const categoriaLabel = order ? CATEGORIA_LABEL[order.categoria] ?? order.categoria : null;
  const statusLabel = order ? STATUS_LABEL[order.status] ?? order.status : null;
  const dataHora = order?.dataDesejada ? formatDateAndTime(order.dataDesejada) : null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.surface }]} onPress={() => router.back()}>
          <Text style={[styles.backArrow, { color: colors.textPrimary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Interessados</Text>
        <View style={styles.headerSpacer} />
      </View>

      {!isLoading && !isError && order && (
        <View style={[styles.orderBanner, { backgroundColor: colors.brand + "1A" }]}>
          <View style={styles.orderBannerRow}>
            <View style={[styles.orderDot, { backgroundColor: colors.brand }]} />
            <View style={styles.orderBannerTextContainer}>
              {categoriaLabel && (
                <Text style={[styles.orderCategory, { color: colors.brand }]}>{categoriaLabel}</Text>
              )}
              {statusLabel && dataHora && (
                <Text style={[styles.orderSubtitle, { color: colors.textSecondary }]}>{statusLabel} · {dataHora}</Text>
              )}
            </View>
          </View>
          <Text style={[styles.orderCount, { color: colors.brand }]}>{proposals.length}</Text>
        </View>
      )}

      {!isLoading && !isError && proposals.length > 0 && (
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={filtro === "todos" ? [styles.filterChipActive, { backgroundColor: colors.brand }] : [styles.filterChipInactive, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setFiltro("todos")}
          >
            <Text style={filtro === "todos" ? [styles.filterTextActive, { color: colors.onBrand }] : [styles.filterTextInactive, { color: colors.textSecondary }]}>
              Todos ({proposals.length})
            </Text>
          </TouchableOpacity>

          {FILTRO_LABELS.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={filtro === key ? [styles.filterChipActive, { backgroundColor: colors.brand }] : [styles.filterChipInactive, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => setFiltro(key)}
            >
              <Text style={filtro === key ? [styles.filterTextActive, { color: colors.onBrand }] : [styles.filterTextInactive, { color: colors.textSecondary }]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.filterChipInactive, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.filterTextInactive, { color: colors.textSecondary }]}>Mais...</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: colors.error }]}>Erro ao carregar propostas. Tente novamente.</Text>
        </View>
      ) : proposals.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhuma proposta recebida ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={propostasOrdenadas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 20, gap: 16 }}
          renderItem={({ item, index }) => (
            <PropostaCard
              proposta={item}
              destacada={index === 0 && filtro === "melhor_avaliacao"}
              onNegociar={() => router.push(`/(client)/(chats)/${item.id}`)}
              onVerProposta={() => router.push(`/(client)/(orders)/${orderId}/proposals/${item.id}`)}
              onVerPerfil={() => router.push(`/(client)/(home)/${item.profissional.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
    marginLeft: 16,
  },
  headerSpacer: {
    width: 44,
  },
  orderBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderBannerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  orderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  orderBannerTextContainer: {
    flex: 1,
  },
  orderCategory: {
    fontSize: 15,
    fontWeight: "700",
  },
  orderSubtitle: {
    fontSize: 13,
  },
  orderCount: {
    fontSize: 24,
    fontWeight: "700",
  },
  filterRow: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: "row",
    gap: 8,
  },
  filterChipActive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  filterChipInactive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
  },
  filterTextActive: {
    fontSize: 13,
    fontWeight: "700",
  },
  filterTextInactive: {
    fontSize: 13,
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
  },
});
