import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { OrderDetailValidationContent } from "@/features/orders/components/OrderDetailValidationContent";

export default function PedidoAguardandoValidacaoScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const pedidoId = Number(orderId);

  // Consome o hook SWR para buscar os dados do pedido em tempo real
  const { data: pedido, isLoading, error } = useOrderDetail(pedidoId);

  // Estado local de loading para os botões (evitar duplo clique)
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    router.push(`/(client)/(orders)/${pedidoId}/complete`);
  };

  const handleIssue = () => {
    // Navega para a tela de contestação/problema
    router.push(`/(client)/(orders)/${pedidoId}/issue`);
  };

  return (
    <OrderDetailValidationContent
      pedido={pedido}
      isLoading={isLoading}
      error={error}
      onBack={() => router.back()}
      onConfirm={handleConfirm}
      isConfirming={isConfirming}
      onIssue={handleIssue}
    />
  );
}
