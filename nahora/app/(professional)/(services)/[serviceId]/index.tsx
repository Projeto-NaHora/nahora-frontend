import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import {
  CATEGORIA_LABEL,
  getTurnoKey,
  TURNO_TIME_RANGES,
} from "@/features/orders/types";
import { useAvaliacao } from "@/features/ratings/hooks/useAvaliacao";

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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F26F21" />
      </View>
    );
  }

  if (error || !pedido) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar serviço.</Text>
        <TouchableOpacity
          style={styles.backBtnFallback}
          onPress={() => router.back()}
        >
          <Text style={styles.backBtnFallbackText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const badge = getStatusDisplay(pedido.status);
  const isConcluido = pedido.status === "CONCLUIDO";
  const categoria =
    CATEGORIA_LABEL[pedido.categoria] ?? pedido.categoria ?? "Serviço";
  const dataFormatada = pedido.dataDesejada
    ? formatDate(pedido.dataDesejada)
    : "";
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
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>{"←"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhe do serviço</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category + status */}
        <View style={styles.categoryRow}>
          <Text style={styles.categoryHeading}>{categoria}</Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.color }]}>
              {badge.text}
            </Text>
          </View>
        </View>

        {/* Info card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Data</Text>
              <Text style={styles.infoValue}>{dataFormatada}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Horário</Text>
              <Text style={styles.infoValue}>{turnoFormatado}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Endereço</Text>
            <Text style={styles.infoValue}>{enderecoFormatado}</Text>
          </View>
        </View>

        {/* Description card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>DESCRIÇÃO</Text>
          <Text style={styles.descriptionText}>{pedido.descricao}</Text>
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Linha do tempo</Text>
          {timelineStages.map((item, index) => {
            const isLast = index === timelineStages.length - 1;
            return (
              <View key={item.label} style={styles.timelineRow}>
                <View style={styles.timelineDotCol}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: item.done ? "#10B981" : "#E5E7EB",
                        borderColor: item.done ? "#10B981" : "#E5E7EB",
                      },
                    ]}
                  />
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor: item.done ? "#10B981" : "#E5E7EB",
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
                        color: item.done ? "#111827" : "#9CA3AF",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isLast && !isConcluido && (
                    <Text style={styles.timelineSub}>—</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Rate button footer */}
      {mostrarAvaliar && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() =>
              router.push(`/(professional)/(services)/${serviceId}/rating`)
            }
            activeOpacity={0.7}
          >
            <Text style={styles.rateButtonText}>Avaliar cliente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    marginBottom: 16,
  },
  backBtnFallback: {
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  backBtnFallbackText: {
    color: "#374151",
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
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
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
    color: "#111827",
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
    borderColor: "#F3F4F6",
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
    color: "#6B7280",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
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
    color: "#6B7280",
    letterSpacing: 1,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#374151",
    lineHeight: 20,
  },

  // Timeline
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
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
    color: "#6B7280",
    marginTop: 2,
  },

  // Footer
  footer: {
    padding: 24,
    paddingBottom: 48,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
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
