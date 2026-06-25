// features/professional/components/AvailableOrderCard.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
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

function computeTimeAgo(iso: string): string {
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

function useRelativeTime(iso: string | undefined, intervalMs = 30000) {
  const [label, setLabel] = useState(() => computeTimeAgo(iso ?? ""));

  useEffect(() => {
    if (!iso) return;
    setLabel(computeTimeAgo(iso));
    const timer = setInterval(() => {
      setLabel(computeTimeAgo(iso));
    }, intervalMs);
    return () => clearInterval(timer);
  }, [iso, intervalMs]);

  return label;
}

export function AvailableOrderCard({
  pedido,
  onPress,
}: AvailableOrderCardProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const categoryLabel =
    CATEGORIA_LABEL[pedido.categoria] ?? pedido.categoria;
  const timeAgo = useRelativeTime(pedido.criadoEm);

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}
      onPress={() => onPress(pedido)}
    >
      {/* Accent bar */}
      <View style={styles.accentBar} />

      <View style={styles.content}>
        {/* Top row: category + client name */}
        <View style={styles.topRow}>
          <Text style={[styles.categoryTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {categoryLabel}
          </Text>
          <Text style={[styles.clientName, { color: colors.textSecondary }]} numberOfLines={1}>
            {pedido.nomeCliente ?? ""}
          </Text>
        </View>

        {/* Distance + time */}
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
          {formatDistance(pedido.distanciaKm)}{" "}
          {pedido.criadoEm ? `· ${timeAgo}` : ""}
        </Text>

        {/* Description (titulo) */}
        <Text style={[styles.description, { color: colors.textPrimary }]} numberOfLines={2}>
          {pedido.titulo}
        </Text>

        {/* Footer: category pill + status */}
        <View style={styles.footer}>
          <View style={[styles.categoryPill, { borderColor: colors.border }]}>
            <Text style={styles.categoryIcon}>⚡</Text>
            <Text style={[styles.categoryPillText, { color: colors.textSecondary }]}>{categoryLabel}</Text>
          </View>
          {pedido.statusPedido === "ABERTO" && (
            <View style={[styles.statusBadge, { backgroundColor: "#E8F5E9" }]}>
              <Text style={[styles.statusText, { color: "#2E7D32" }]}>Aberto</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
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
  clientName: {
    fontSize: 13,
    fontFamily: "Inter",
    fontWeight: "500",
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
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Inter",
    fontWeight: "700",
  },
});
