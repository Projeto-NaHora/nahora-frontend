import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import useSWR from "swr";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Fonts } from "@/constants/theme";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { getApiErrorMessage } from "@/utils/apiError";
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { Pedido, FiltroStatus } from "@/features/orders/types";
import type { HistoricoResumoResponse } from "@/features/profile/types";
import { CATEGORIA_LABEL } from "@/features/orders/types";

function formatCurrency(value: number | undefined | null): string {
  if (value == null) return "R$ 0";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getInitials(name: string): string {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .filter((_, i, arr) => i === 0 || i === arr.length - 1)
        .join("")
        .toUpperCase()
    : "??";
}

/** Payment status to display label */
function getPaymentStatusLabel(status: string | undefined): string {
  if (!status) return "—";
  const map: Record<string, string> = {
    PAGO: "PAGO",
    PENDENTE: "PENDENTE",
    PROCESSANDO: "PROCESSANDO",
    CANCELADO: "CANCELADO",
    REEMBOLSADO: "REEMBOLSADO",
  };
  return map[status] ?? status;
}

/** Payment status badge colors */
function getPaymentStatusColors(
  status: string | undefined,
): { bg: string; text: string } {
  if (status === "PAGO") return { bg: "#e3f5e7", text: "#1f9945" };
  if (status === "PENDENTE" || status === "PROCESSANDO")
    return { bg: "#FFF3CD", text: "#856404" };
  return { bg: "#F5F5F5", text: "#8E8E93" };
}

export default function HistoryScreen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [filtro] = useState<FiltroStatus>("CONCLUIDOS");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: pedidosPage,
    isLoading,
    error,
    mutate,
  } = useOrders({ status: filtro });

  const { data: resumo, isLoading: resumoLoading } =
    useSWR<HistoricoResumoResponse>(
      ENDPOINTS.HISTORICO_RESUMO,
      async (url: string) => {
        const { data } = await api.get<HistoricoResumoResponse>(url);
        return data;
      },
    );

  const handleOrderPress = (pedido: Pedido) => {
    router.push(`/(client)/(account)/history-detail?id=${pedido.id}`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
  };

  if (isLoading || resumoLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (error) {
    console.error("[H02] Erro ao carregar histórico:", error);
    const mensagem = getApiErrorMessage(
      error,
      "Erro de conexão com o servidor",
    );
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorIcon]}>⚠️</Text>
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          Não foi possível carregar o histórico
        </Text>
        <Text style={[styles.errorDetail, { color: colors.textSecondary }]}>
          {mensagem}
        </Text>
        <Pressable
          onPress={() => mutate()}
          style={({ pressed }) => [
            styles.retryButton,
            { backgroundColor: colors.brand },
            pressed && styles.retryButtonPressed,
          ]}
        >
          <Text style={[styles.retryButtonText, { color: colors.onBrand }]}>
            Tentar novamente
          </Text>
        </Pressable>
      </View>
    );
  }

  const pedidos = pedidosPage?.content ?? [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: "rgba(244,244,245,0.6)" },
            pressed && styles.backButtonPressed,
          ]}
        >
          <IconSymbol name="chevron.left" size={20} color="#1c1c1e" />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Histórico de Serviços
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <>
            {/* Summary Bar */}
            <View style={styles.summaryBar}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {resumo?.totalServicos ?? 0}
                </Text>
                <Text style={styles.summaryLabel}>Serviços</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {formatCurrency(resumo?.totalPago)}
                </Text>
                <Text style={styles.summaryLabel}>Total pago</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <View style={styles.ratingRow}>
                  <Text
                    style={[styles.summaryValue, { color: "#e67215" }]}
                  >
                    {resumo?.mediaAvaliacoes != null
                      ? Number(resumo.mediaAvaliacoes).toFixed(1)
                      : "—"}
                  </Text>
                  <IconSymbol name="star.fill" size={16} color="#e67215" />
                </View>
                <Text style={styles.summaryLabel}>Média</Text>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhum serviço no histórico
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const categoryLabel =
            CATEGORIA_LABEL[item.categoria] ?? item.categoria;
          const payStatus = getPaymentStatusLabel(item.pagamento?.status);
          const payColors = getPaymentStatusColors(item.pagamento?.status);
          const price =
            item.valorAcordado ?? item.orcamentoEstimado ?? undefined;

          return (
            <Pressable
              style={[
                styles.card,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => handleOrderPress(item)}
            >
              {/* Row 1: Category + Payment badge */}
              <View style={styles.cardRow1}>
                <Text
                  style={[styles.cardCategory, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {categoryLabel}
                </Text>
                <View
                  style={[
                    styles.paymentBadge,
                    { backgroundColor: payColors.bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.paymentBadgeText,
                      { color: payColors.text },
                    ]}
                  >
                    {payStatus}
                  </Text>
                </View>
              </View>

              {/* Row 2: Professional name · date */}
              <View style={styles.cardRow2}>
                <Text
                  style={[
                    styles.cardSubtitle,
                    { color: colors.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {item.profissionalAtribuidoNome ?? "—"}
                </Text>
              </View>

              {/* Row 3: Rating + price */}
              <View style={styles.cardRow3}>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = item.avaliacaoNota != null && star <= item.avaliacaoNota;
                    return (
                      <IconSymbol
                        key={star}
                        name={filled ? "star.fill" : "star"}
                        size={14}
                        color={filled ? "#ffb300" : "#d1d5db"}
                      />
                    );
                  })}
                  <Text style={styles.ratingText}>
                    {item.avaliacaoNota != null
                      ? Number(item.avaliacaoNota).toFixed(1)
                      : "—"}
                  </Text>
                </View>

                {price != null && (
                  <Text
                    style={[styles.cardPrice, { color: colors.textPrimary }]}
                  >
                    {formatCurrency(price)}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        }}
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
    paddingHorizontal: 32,
    gap: 12,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorText: {
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
    textAlign: "center",
  },
  errorDetail: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 27,
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Summary Bar
  summaryBar: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 28,
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  summaryValue: {
    fontFamily: Fonts?.sans,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 30,
    color: "#111111",
  },
  summaryLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 19.5,
    color: "#8c8c8c",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#eaeaea",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  // Empty
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "400",
  },

  // Card
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardCategory: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 16,
  },
  paymentBadge: {
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  paymentBadgeText: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16.5,
    letterSpacing: 0.55,
  },
  cardRow2: {
    marginBottom: 6,
  },
  cardSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 13,
  },
  cardRow3: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 19.5,
    color: "#8c8c8c",
    marginLeft: 4,
  },
  cardPrice: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
});
