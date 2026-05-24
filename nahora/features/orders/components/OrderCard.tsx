// features/orders/components/OrderCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Pedido } from "../types";
import { CATEGORIA_LABEL, STATUS_LABEL, STATUS_COLORS } from "../types";

interface OrderCardProps {
  pedido: Pedido;
  onPress: (pedido: Pedido) => void;
}

/** Formata data ISO para "dd/mm/aaaa" */
function formatDate(iso: string): string {
  const d = new Date(iso);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${d.getFullYear()}`;
}

/** Extrai o período do dia a partir da hora */
function getPeriodo(iso: string): string {
  const hora = new Date(iso).getHours();
  if (hora < 12) return "Manhã";
  if (hora < 18) return "Tarde";
  return "Noite";
}

export default function OrderCard({ pedido, onPress }: OrderCardProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const statusInfo = STATUS_COLORS[pedido.status] ?? {
    bg: "#F5F5F5",
    text: "#8E8E93",
  };
  const categoryLabel = CATEGORIA_LABEL[pedido.categoria] ?? pedido.categoria;
  const statusLabel = STATUS_LABEL[pedido.status] ?? pedido.status;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.border + "CC",
        },
      ]}
      activeOpacity={0.7}
      onPress={() => onPress(pedido)}
    >
      {/* Linha do topo: título + badge */}
      <View style={styles.headerRow}>
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {categoryLabel}
        </Text>
        <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.badgeText, { color: statusInfo.text }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      {/* Data desejada + período */}
      <View style={styles.dateRow}>
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>
          {formatDate(pedido.dataDesejada)} - {getPeriodo(pedido.dataDesejada)}
        </Text>
      </View>

      {/* Descrição */}
      <View style={styles.descriptionRow}>
        <Text
          style={[styles.descriptionText, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {pedido.descricao}
        </Text>
      </View>

      {/* Endereço */}
      {pedido.endereco && (
        <View style={styles.addressRow}>
          <Text
            style={[styles.addressText, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {pedido.endereco.logradouro}, {pedido.endereco.numero} -{" "}
            {pedido.endereco.bairro}, {pedido.endereco.cidade}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontFamily: "Inter",
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "700",
  },
  dateRow: {
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
  },
  descriptionRow: {
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
  },
  addressRow: {
    marginTop: 4,
  },
  addressText: {
    fontSize: 13,
    fontFamily: "Inter",
    fontWeight: "400",
  },
});
