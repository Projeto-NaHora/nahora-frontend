import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useChatColors } from "@/hooks/use-chat-colors";

interface Props {
  valorProposta: number;
  statusProposta?: string;
  onVerDetalhes: () => void;
  papel: "CLIENTE" | "PROFISSIONAL";
}

const STATUS_LABELS: Record<string, string> = {
  PENDENTE: "PROPOSTA EM ANDAMENTO",
  ACEITA: "PROPOSTA ACEITA",
  REJEITADA: "PROPOSTA REJEITADA",
  EXPIRADA: "PROPOSTA EXPIRADA",
};

export function ProposalBanner({
  valorProposta,
  statusProposta,
  onVerDetalhes,
  papel,
}: Props) {
  const colors = useChatColors();

  if (statusProposta !== "PENDENTE" && statusProposta !== "ACEITA") return null;

  const label = STATUS_LABELS[statusProposta ?? ""] ?? "PROPOSTA EM ANDAMENTO";
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorProposta);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.proposalBg,
          borderColor: colors.proposalBorder,
        },
      ]}
    >
      <View style={styles.left}>
        <Text style={[styles.label, { color: colors.proposalText }]}>
          {label}
        </Text>
        <Text style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: colors.darkText }]}>
            Valor proposto:{" "}
          </Text>
          <Text style={[styles.priceValue, { color: colors.proposalText }]}>
            {formattedValue}
          </Text>
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.cta, { backgroundColor: colors.brandOrange }]}
        onPress={onVerDetalhes}
      >
        <Text style={styles.ctaText}>
          {papel === "PROFISSIONAL" ? "Editar proposta" : "Ver detalhes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  left: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.3,
  },
  priceRow: {
    fontSize: 14,
  },
  priceLabel: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 14,
  },
  priceValue: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 14,
  },
  cta: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  ctaText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 13,
    color: "#ffffff",
  },
});
