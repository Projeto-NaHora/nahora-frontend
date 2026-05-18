import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useSWR from "swr";
import { orderService } from "@/features/orders/service";

const STATUS_TIMELINE = [
  { key: "CRIADO", label: "Pedido criado" },
  { key: "PROPOSTA_ACEITA", label: "Proposta acordada" },
  { key: "EM_ANDAMENTO", label: "Serviço em andamento" },
  { key: "CONCLUIDO", label: "Concluído" },
];

export default function PedidoAtivoScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();

  const { data: pedido, isLoading, error } = useSWR(
    orderId ? `/pedidos/${orderId}` : null,
    () => orderService.buscarPorId(Number(orderId))
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (error || !pedido) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar pedido.</Text>
      </View>
    );
  }

  const statusIndex = STATUS_TIMELINE.findIndex((s) => s.key === pedido.status);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhe do Pedido</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>Em andamento</Text>
        </View>
      </View>

      <ScrollView>
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.orderTitle}>{pedido.titulo}</Text>

            <View style={styles.detailRow}>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Data</Text>
                <Text style={styles.detailValue}>
                  {new Date(pedido.criadoEm).toLocaleDateString("pt-BR")}
                </Text>
              </View>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Horário</Text>
                <Text style={styles.detailValue}>
                  {new Date(pedido.criadoEm).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Endereço</Text>
              <Text style={styles.detailValue}>—</Text>
            </View>

            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>DESCRIÇÃO</Text>
              <Text style={styles.descriptionText}>{pedido.descricao}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.timelineTitle}>Linha do tempo</Text>
            {STATUS_TIMELINE.map((item, index) => {
              const concluido = index <= statusIndex;
              const atual = index === statusIndex;

              return (
                <View key={item.key} style={styles.timelineItem}>
                  <View style={styles.timelineDotContainer}>
                    <View
                      style={[
                        styles.timelineDot,
                        concluido
                          ? styles.timelineDotComplete
                          : styles.timelineDotPending,
                        atual && styles.timelineDotActive,
                      ]}
                    />
                    {index < STATUS_TIMELINE.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          concluido
                            ? styles.timelineLineComplete
                            : styles.timelineLinePending,
                        ]}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.timelineLabel,
                      concluido
                        ? styles.timelineLabelComplete
                        : styles.timelineLabelPending,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.problemButton}>
          <Text style={styles.problemButtonText}>Tive um problema</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => router.push(`/(client)/(chats)/${pedido.id}`)}
        >
          <Text style={styles.chatButtonText}>Falar com profissional</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    gap: 8,
  },
  backArrow: {
    fontSize: 24,
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    color: "#111827",
  },
  statusBadge: {
    backgroundColor: "#f0fdf4",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusBadgeText: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "700",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  orderTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: "#111827",
  },
  detailRow: {
    flexDirection: "row",
    gap: 24,
  },
  detailCol: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: "#9ca3af",
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "500",
  },
  descriptionText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  timelineTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
    color: "#111827",
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  timelineDotContainer: {
    alignItems: "center",
    width: 16,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  timelineDotComplete: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  timelineDotActive: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },
  timelineDotPending: {
    backgroundColor: "#e5e7eb",
    borderColor: "#d1d5db",
  },
  timelineLine: {
    width: 2,
    height: 32,
  },
  timelineLineComplete: {
    backgroundColor: "#22c55e",
  },
  timelineLinePending: {
    backgroundColor: "#e5e7eb",
  },
  timelineLabel: {
    fontSize: 14,
  },
  timelineLabelComplete: {
    color: "#1f2937",
    fontWeight: "500",
  },
  timelineLabelPending: {
    color: "#9ca3af",
  },
  bottomBar: {
    padding: 16,
    gap: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  problemButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  problemButtonText: {
    color: "#4b5563",
    fontSize: 15,
  },
  chatButton: {
    backgroundColor: "#f97316",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  chatButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});
