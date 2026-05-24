import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChatColors } from "@/constants/theme";

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
  if (statusProposta !== "PENDENTE" && statusProposta !== "ACEITA") return null;

  const label = STATUS_LABELS[statusProposta ?? ""] ?? "PROPOSTA EM ANDAMENTO";
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorProposta);

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.priceRow}>
          <Text style={styles.priceLabel}>Valor proposto: </Text>
          <Text style={styles.priceValue}>{formattedValue}</Text>
        </Text>
      </View>
      <TouchableOpacity style={styles.cta} onPress={onVerDetalhes}>
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
    backgroundColor: ChatColors.proposalBg,
    borderWidth: 1,
    borderColor: ChatColors.proposalBorder,
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
    color: ChatColors.proposalText,
    letterSpacing: 0.3,
  },
  priceRow: {
    fontSize: 14,
  },
  priceLabel: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 14,
    color: ChatColors.darkText,
  },
  priceValue: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 14,
    color: ChatColors.proposalText,
  },
  cta: {
    backgroundColor: ChatColors.brandOrange,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  ctaText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 13,
    color: ChatColors.white,
  },
});
