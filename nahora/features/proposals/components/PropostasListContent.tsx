import React, { useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProposalsByPedido } from "@/features/proposals/hooks/useProposals";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { CATEGORIA_LABEL, STATUS_LABEL } from "@/features/orders/types";
import { PropostaCard } from "@/features/proposals/components/PropostaCard";

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
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Interessados</Text>
        <View style={styles.headerSpacer} />
      </View>

      {!isLoading && !isError && order && (
        <View style={styles.orderBanner}>
          <View style={styles.orderBannerRow}>
            <View style={styles.orderDot} />
            <View style={styles.orderBannerTextContainer}>
              {categoriaLabel && (
                <Text style={styles.orderCategory}>{categoriaLabel}</Text>
              )}
              {statusLabel && dataHora && (
                <Text style={styles.orderSubtitle}>{statusLabel} · {dataHora}</Text>
              )}
            </View>
          </View>
          <Text style={styles.orderCount}>{proposals.length}</Text>
        </View>
      )}

      {!isLoading && !isError && proposals.length > 0 && (
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={filtro === "todos" ? styles.filterChipActive : styles.filterChipInactive}
            onPress={() => setFiltro("todos")}
          >
            <Text style={filtro === "todos" ? styles.filterTextActive : styles.filterTextInactive}>
              Todos ({proposals.length})
            </Text>
          </TouchableOpacity>

          {FILTRO_LABELS.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={filtro === key ? styles.filterChipActive : styles.filterChipInactive}
              onPress={() => setFiltro(key)}
            >
              <Text style={filtro === key ? styles.filterTextActive : styles.filterTextInactive}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.filterChipInactive}>
            <Text style={styles.filterTextInactive}>Mais...</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Erro ao carregar propostas. Tente novamente.</Text>
        </View>
      ) : proposals.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Nenhuma proposta recebida ainda.</Text>
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
              onNegociar={() => router.push(`/(client)/(orders)/${orderId}/proposals/${item.id}`)}
              onVerPerfil={() => router.push(`/(client)/profile/${item.profissional.id}`)}
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
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#ffffff",
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
    backgroundColor: "rgba(244, 244, 245, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 20,
    color: "#1c1c1e",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1c1c1e",
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
    backgroundColor: "#fff2e5",
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
    backgroundColor: "#f27b24",
  },
  orderBannerTextContainer: {
    flex: 1,
  },
  orderCategory: {
    fontSize: 15,
    fontWeight: "700",
    color: "#e67215",
  },
  orderSubtitle: {
    fontSize: 13,
    color: "#cd7b40",
  },
  orderCount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f27b24",
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
    backgroundColor: "#f27b24",
  },
  filterChipInactive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  filterTextActive: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
  filterTextInactive: {
    fontSize: 13,
    fontWeight: "700",
    color: "#8c8c8c",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 14,
  },
});
