import React from "react";
import { View, Text, StyleSheet } from "react-native";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

interface PaymentTotalCardProps {
  valor: number;
}

export function PaymentTotalCard({ valor }: PaymentTotalCardProps) {
  const formatted = currencyFormatter.format(valor);

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>Total a pagar</Text>
      </View>
      <View>
        <Text style={styles.value}>{formatted}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#dff6e6",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#1f9945",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 22.5,
  },
  value: {
    color: "#1f9945",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
});
