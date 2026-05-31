import React, { useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { orderService } from "@/features/orders/service";
import { OrderIssueContent } from "@/features/orders/components/OrderIssueContent";

export default function PedidoReportarProblemaScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const pedidoId = Number(orderId);

  const { data: pedido, isLoading } = useOrderDetail(pedidoId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (motivo: string, descricao: string) => {
    setIsSubmitting(true);
    try {
      // Chama o backend para mudar o status para EM_DISPUTA
      await orderService.reportarProblema(pedidoId);

      // Se deu tudo certo, vai para a tela de Sucesso (C102)
      router.push(`/(client)/(orders)/${pedidoId}/issue/success`);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível abrir a disputa. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <OrderIssueContent
      pedido={pedido}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onBack={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}
