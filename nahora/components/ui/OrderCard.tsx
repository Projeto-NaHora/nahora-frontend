import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RecentOrder } from "../../store/homeStore";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

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
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const config = statusConfig[order.status];

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {order.titulo}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
          <Text style={[styles.statusText, { color: config.text }]}>
            {config.label}
          </Text>
        </View>
      </View>
      <Text style={[styles.professionalName, { color: colors.textSecondary }]} numberOfLines={1}>
        {order.nomeProfissional}
      </Text>
      <Text style={[styles.dateText, { color: colors.textSecondary }]}>{order.data}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
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
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
  },
});

export default OrderCard;
