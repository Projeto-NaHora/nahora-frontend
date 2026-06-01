import React from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router"; // <-- Adicionado o Redirect aqui
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { orderService } from "@/features/orders/service";
import { OrderDetailOpenContent } from "@/features/orders/components/OrderDetailOpenContent";

export default function PedidoAbertoScreen() {
  const { orderId, acceptedProposalId } = useLocalSearchParams<{
    orderId: string;
    acceptedProposalId?: string;
  }>();
  const router = useRouter();
  const pedidoId = Number(orderId);
  const { data: pedido, isLoading, error } = useOrderDetail(pedidoId);

  if (pedido?.status === "AGUARDANDO_VALIDACAO") {
    return <Redirect href={`/(client)/(orders)/${orderId}/validation`} />;
  }

  if (pedido?.status === "EM_ANDAMENTO") {
    return <Redirect href={`/(client)/(orders)/${orderId}/active`} />;
  }

  const handleDelete = () => {
    Alert.alert(
      "Excluir pedido",
      "Tem certeza que deseja excluir este pedido?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await orderService.cancelar(pedidoId);
              router.back();
            } catch {
              Alert.alert("Erro", "Não foi possível excluir o pedido.");
            }
          },
        },
      ],
    );
  };

  return (
    <OrderDetailOpenContent
      pedido={pedido}
      isLoading={isLoading}
      error={error}
      onBack={() => router.back()}
      onEdit={() => router.push(`/(client)/(orders)/new?editId=${orderId}`)}
      onDelete={handleDelete}
      onViewProposals={() =>
        router.push(`/(client)/(orders)/${orderId}/proposals`)
      }
      acceptedProposalId={
        acceptedProposalId ? Number(acceptedProposalId) : undefined
      }
    />
  );
}
