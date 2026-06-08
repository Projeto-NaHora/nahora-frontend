import React from "react";
import { View, Text, StyleSheet } from "react-native";

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

export function ReceiptCard({
  valor,
  dataPagamento,
  metodo,
  codigoTransacao,
}: ReceiptCardProps) {
  const formattedValor = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

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
    <View style={styles.card}>
      <View style={styles.valorSection}>
        <Text style={styles.valorLabel}>Valor pago</Text>
        <Text style={styles.valorValue}>{formattedValor}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Data e Hora</Text>
          <Text style={styles.detailValue}>{formatDate(dataPagamento)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Método</Text>
          <Text style={styles.detailValue}>
            {METODO_LABEL[metodo] ?? metodo}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transação</Text>
          <Text style={styles.transactionValue}>
            {codigoTransacao ?? "—"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#eaeaea",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
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
    color: "#8c8c8c",
    marginBottom: 2,
  },
  valorValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111111",
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
    color: "#8c8c8c",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
  },
  transactionValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#f27b24",
  },
});
