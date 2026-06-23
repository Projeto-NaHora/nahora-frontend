import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { mutate } from "swr";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { avaliacaoService } from "@/features/ratings/service";
import { RatingForm } from "@/features/ratings/components/RatingForm";

function getInitials(name: string): string {
  if (!name) return "CL";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export default function ProRatingScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const pedidoId = Number(serviceId);

  const { data: pedido, isLoading } = useOrderDetail(pedidoId);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#F26F21" />
      </View>
    );
  }

  if (!pedido) return null;

  const nomeCliente = pedido.clienteNome ?? "Cliente";
  const categoria = pedido.categoria ?? "";
  const data = pedido.dataDesejada
    ? formatDate(pedido.dataDesejada)
    : "";

  return (
    <RatingForm
      nomeAvaliado={nomeCliente}
      iniciais={getInitials(nomeCliente)}
      categoria={categoria}
      data={data}
      papel="PROFISSIONAL"
      onSubmit={async ({ nota, comentario, tags }) => {
        await avaliacaoService.criar(pedidoId, { nota, comentario, tags });
        await mutate(`avaliacao-pedido-${pedidoId}`);
      }}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
