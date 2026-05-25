import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RecentOrder } from "../../store/homeStore";

type Props = {
  order: RecentOrder;
};

const statusConfig: Record<
  RecentOrder["status"],
  { bg: string; text: string; label: string }
> = {
  em_andamento: { bg: "#DBEAFE", text: "#1D4ED8", label: "Em andamento" },
  concluido: { bg: "#DCFCE3", text: "#15803D", label: "Concluído" },
  cancelado: { bg: "#FEE2E2", text: "#B91C1C", label: "Cancelado" },
};

export const OrderCard: React.FC<Props> = ({ order }) => {
  const config = statusConfig[order.status];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {order.titulo}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
          <Text style={[styles.statusText, { color: config.text }]}>
            {config.label}
          </Text>
        </View>
      </View>
      <Text style={styles.professionalName} numberOfLines={1}>
        {order.nomeProfissional}
      </Text>
      <Text style={styles.dateText}>{order.data}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  professionalName: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});

export default OrderCard;
