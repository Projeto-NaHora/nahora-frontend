import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

interface ReceiptCardProps {
  valor: number;
  dataPagamento: string | null;
  metodo: string;
  codigoTransacao: string | null;
}

const METODO_LABEL: Record<string, string> = {
  PIX: "Pix",
  CARTAO_CREDITO: "Cartão de Crédito",
};

function formatDate(iso: string | null): string {
  if (!iso) return "�";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "�";
  const date = d.toLocaleDateString("pt-BR");
  const time = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} � ${time}`;
}

export function ReceiptCard({
  valor,
  dataPagamento,
  metodo,
  codigoTransacao,
}: ReceiptCardProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const formattedValor = currencyFormatter.format(valor);

  const formatDate = (iso: string | null): string => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    const date = d.toLocaleDateString("pt-BR");
    const time = d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} • ${time}`;
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={[styles.valorSection, { borderBottomColor: colors.border }]}>
        <Text style={[styles.valorLabel, { color: colors.textSecondary }]}>Valor pago</Text>
        <Text style={[styles.valorValue, { color: colors.text }]}>{formattedValor}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Data e Hora</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{formatDate(dataPagamento)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Método</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {METODO_LABEL[metodo] ?? metodo}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transação</Text>
          <Text style={[styles.transactionValue, { color: colors.brand }]}>
            {codigoTransacao ?? "—"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  },
  valorSection: {
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    marginBottom: 16,
  },
  valorLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  valorValue: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 48,
  },
  details: {
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  transactionValue: {
    fontSize: 14,
    fontWeight: "500",
  },
});
