import React from "react";
import { View,
  Text,
  ScrollView,ActivityIndicator,
  StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import {
  CATEGORIA_LABEL,
  getTurnoKey,
  TURNO_TIME_RANGES,
} from "@/features/orders/types";
import { useAvaliacao } from "@/features/ratings/hooks/useAvaliacao";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function formatEndereco(endereco: any): string {
  if (!endereco) return "—";
  return `${endereco.logradouro}, ${endereco.numero} – ${endereco.bairro}, ${endereco.cidade}`;
}

function getStatusDisplay(status: string) {
  switch (status) {
    case "EM_ANDAMENTO":
      return { text: "EM ANDAMENTO", color: "#417BE0", bg: "#E6F0FF" };
    case "AGUARDANDO_VALIDACAO":
      return { text: "AGUARDANDO CLIENTE", color: "#D97706", bg: "#FEF3C7" };
    case "CONCLUIDO":
      return { text: "CONCLUÍDO", color: "#10B981", bg: "#D1FAE5" };
    case "EM_DISPUTA":
      return { text: "EM DISPUTA", color: "#DC2626", bg: "#FEE2E2" };
    case "CANCELADO":
      return { text: "CANCELADO", color: "#6B7280", bg: "#F3F4F6" };
    default:
      return { text: status || "SERVIÇO", color: "#6B7280", bg: "#F3F4F6" };
  }
}

export default function ProServiceDetailScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const router = useRouter();
  const pedidoId = Number(serviceId);
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const { data: pedido, isLoading, error } = useOrderDetail(pedidoId);
  const { jaAvaliou } = useAvaliacao(pedidoId);

  // Redirects for non-completed statuses
  if (
    pedido?.status === "AGUARDANDO_PAGAMENTO" ||
    pedido?.status === "EM_ANDAMENTO" ||
    pedido?.status === "AGUARDANDO_VALIDACAO"
  ) {
    return <Redirect href={`/(professional)/(services)/${serviceId}/active`} />;
  }

  if (pedido?.status === "EM_DISPUTA") {
    return (
      <Redirect
        href={`/(professional)/(services)/${serviceId}/issue/dispute`}
      />
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (error || !pedido) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={styles.errorText}>Erro ao carregar serviço.</Text>
        <Pressable
          style={[styles.backBtnFallback, { backgroundColor: colors.surfaceGray }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backBtnFallbackText, { color: colors.text }]}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const badge = getStatusDisplay(pedido.status);
  const isConcluido = pedido.status === "CONCLUIDO";
  const categoria =
    CATEGORIA_LABEL[pedido.categoria] ?? pedido.categoria ?? "Serviço";
  const turnoKey = getTurnoKey(pedido.dataDesejada);
  const turnoFormatado = turnoKey ? TURNO_TIME_RANGES[turnoKey].label : "";
  const enderecoFormatado = formatEndereco(pedido.endereco);
  const mostrarAvaliar = isConcluido && !jaAvaliou;

  // Timeline stages for completed orders
  const timelineStages = [
    { label: "Pedido criado", done: true },
    { label: "Proposta acordada", done: true },
    { label: "Serviço em andamento", done: true },
    { label: "Concluído", done: isConcluido },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={[styles.backBtn, { backgroundColor: colors.surfaceGray }]} onPress={() => router.back()}>
          <Text style={[styles.backArrow, { color: colors.text }]}>{"←"}</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Detalhe do serviço</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category + status */}
        <View style={styles.categoryRow}>
          <Text style={[styles.categoryHeading, { color: colors.text }]}>{categoria}</Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.color }]}>
              {badge.text}
            </Text>
          </View>
        </View>

        {/* Info card */}
        <View style={[styles.card, { borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Horário</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{turnoFormatado}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoBlock}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Endereço</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{enderecoFormatado}</Text>
          </View>
        </View>

        {/* Description card */}
        <View style={[styles.card, { borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>DESCRIÇÃO</Text>
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>{pedido.descricao}</Text>
        </View>

        {/* Timeline */}
        <View style={[styles.card, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Linha do tempo</Text>
          {timelineStages.map((item, index) => {
            const isLast = index === timelineStages.length - 1;
            return (
              <View key={item.label} style={styles.timelineRow}>
                <View style={styles.timelineDotCol}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: item.done ? colors.success : colors.surfaceGray,
                        borderColor: item.done ? colors.success : colors.surfaceGray,
                      },
                    ]}
                  />
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor: item.done ? colors.success : colors.surfaceGray,
                        },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineLabel,
                      {
                        color: item.done ? colors.text : colors.icon,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isLast && !isConcluido && (
                    <Text style={[styles.timelineSub, { color: colors.textSecondary }]}>—</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Avaliação do cliente */}
        {isConcluido && pedido.avaliacaoNota != null && (
          <View style={[styles.card, { borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Avaliação do cliente</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text
                  key={star}
                  style={[
                    styles.starIcon,
                    {
                      color:
                        star <= pedido.avaliacaoNota
                          ? "#F59E0B"
                          : colors.surfaceGray,
                    },
                  ]}
                >
                  ★
                </Text>
              ))}
              <Text style={[styles.ratingValue, { color: colors.text }]}>
                {pedido.avaliacaoNota}/5
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Rate button footer */}
      {mostrarAvaliar && (
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <Pressable
            style={styles.rateButton}
            onPress={() =>
              router.push(`/(professional)/(services)/${serviceId}/rating`)
            }
          >
            <Text style={styles.rateButtonText}>Avaliar cliente</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    marginBottom: 16,
  },
  backBtnFallback: {
    padding: 12,
    borderRadius: 8,
  },
  backBtnFallbackText: {
    fontWeight: "600",
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
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 22,
    fontWeight: "600",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 44,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
    paddingBottom: 100,
  },

  // Category + badge
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryHeading: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
  },
  badge: {
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // Cards
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },

  // Info card
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  infoCol: {
    flex: 1,
    gap: 4,
  },
  infoBlock: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "400",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 16,
  },

  // Description
  sectionLabel: {
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 1,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },

  // Timeline
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  timelineDotCol: {
    alignItems: "center",
    width: 16,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  timelineLine: {
    width: 2,
    height: 32,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 4,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  timelineSub: {
    fontSize: 12,
    marginTop: 2,
  },

  // Rating
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  starIcon: {
    fontSize: 22,
    lineHeight: 28,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Footer
  footer: {
    padding: 24,
    paddingBottom: 48,
    borderTopWidth: 1,
  },
  rateButton: {
    backgroundColor: "#F26F21",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  rateButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
