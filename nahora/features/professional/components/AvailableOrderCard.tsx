// features/professional/components/AvailableOrderCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { CATEGORIA_LABEL } from "@/features/orders/types";
import type { PedidoDisponivel } from "../types";

interface AvailableOrderCardProps {
  pedido: PedidoDisponivel;
  onPress: (pedido: PedidoDisponivel) => void;
}

function formatDistance(km: number | null | undefined): string {
  if (km == null) return "- km";
  return km.toFixed(1).replace(".", ",") + " km";
}

function formatTimeAgo(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `há ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `há ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `há ${diffD}d`;
}

export function AvailableOrderCard({
  pedido,
  onPress,
}: AvailableOrderCardProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const categoryLabel =
    CATEGORIA_LABEL[pedido.categoria] ?? pedido.categoria;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}
      activeOpacity={0.7}
      onPress={() => onPress(pedido)}
    >
      {/* Accent bar */}
      <View style={styles.accentBar} />

      <View style={styles.content}>
        {/* Top row: category + urgency badge */}
        <View style={styles.topRow}>
          <Text style={[styles.categoryTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {categoryLabel}
          </Text>
          <View
            style={[
              styles.urgencyBadge,
              {
                backgroundColor: pedido.urgente ? "#FFF1E6" : "#FFF8CC",
              },
            ]}
          >
            <Text
              style={[
                styles.urgencyText,
                { color: pedido.urgente ? "#E66A20" : "#D48806" },
              ]}
            >
              {pedido.urgente ? "Urgente" : "Normal"}
            </Text>
          </View>
        </View>

        {/* Client + distance + time */}
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
          {pedido.clienteNome} · {formatDistance(pedido.distanciaKm)} ·{" "}
          {formatTimeAgo(pedido.dataPublicacao)}
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: colors.textPrimary }]} numberOfLines={2}>
          {pedido.descricao}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={[styles.categoryPill, { borderColor: colors.border }]}>
            <Text style={styles.categoryIcon}>⚡</Text>
            <Text style={[styles.categoryPillText, { color: colors.textSecondary }]}>{categoryLabel}</Text>
          </View>
          <Text style={[styles.proposalText, { color: colors.brand }]}>
            {pedido.contadorPropostas}{" "}
            {pedido.contadorPropostas === 1 ? "proposta" : "propostas"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  accentBar: {
    width: 4,
    backgroundColor: "#E66A20",
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 17,
    fontFamily: "Inter",
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  urgencyBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  urgencyText: {
    fontSize: 11,
    fontFamily: "Inter",
    fontWeight: "700",
  },
  metaText: {
    fontSize: 13,
    fontFamily: "Inter",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    lineHeight: 19.25,
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryIcon: {
    fontSize: 12,
  },
  categoryPillText: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "500",
  },
  proposalText: {
    fontSize: 13,
    fontFamily: "Inter",
    fontWeight: "500",
  },
});
