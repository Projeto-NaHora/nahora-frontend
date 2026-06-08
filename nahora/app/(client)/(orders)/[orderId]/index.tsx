import React from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { orderService } from "@/features/orders/service";
import { OrderDetailOpenContent } from "@/features/orders/components/OrderDetailOpenContent";
import { useAvaliacao } from "@/features/ratings/hooks/useAvaliacao";

export default function PedidoAbertoScreen() {
  const { orderId, acceptedProposalId } = useLocalSearchParams<{
    orderId: string;
    acceptedProposalId?: string;
  }>();
  const router = useRouter();
  const pedidoId = Number(orderId);
  const { data: pedido, isLoading, error } = useOrderDetail(pedidoId);
  const { jaAvaliou } = useAvaliacao(pedidoId);

  if (pedido?.status === "EM_DISPUTA") {
    return <Redirect href={`/(client)/(orders)/${orderId}/issue/analysis`} />;
  }

  if (pedido?.status === "AGUARDANDO_VALIDACAO") {
    return <Redirect href={`/(client)/(orders)/${orderId}/validation`} />;
  }

  if (pedido?.status === "EM_ANDAMENTO") {
    return <Redirect href={`/(client)/(orders)/${orderId}/active`} />;
  }

  if (pedido?.status === "AGUARDANDO_PAGAMENTO") {
    return <Redirect href={`/(client)/(orders)/${orderId}/payment`} />;
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
      onRate={
        pedido?.status === "CONCLUIDO" && !jaAvaliou
          ? () => router.push(`/(client)/(orders)/${orderId}/rating`)
          : undefined
      }
      rateButtonLabel="Avaliar serviço"
      acceptedProposalId={
        acceptedProposalId ? Number(acceptedProposalId) : undefined
      }
    />
  );
}
