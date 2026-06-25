import React, { useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";
import { mutate } from "swr";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { ordersKeys } from "@/features/orders/types";
import { orderService } from "@/features/orders/service";
import { OrderCompleteContent } from "@/features/orders/components/OrderCompleteContent";

export default function PedidoCompleteScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const pedidoId = Number(orderId);

  // Consome o hook existente
  const { data: pedido, isLoading, error } = useOrderDetail(pedidoId);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDisputing, setIsDisputing] = useState(false);

  const handleConfirm = () => {
    Alert.alert(
      "Confirmar conclusão?",
      "Ao confirmar, o pagamento será liberado ao profissional e o serviço será encerrado.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: "default",
          onPress: async () => {
            setIsConfirming(true);
            try {
              // 1. Chama a API para fechar o pedido e liberar pagamento
              await orderService.confirmarConclusao(pedidoId);

              // 2. Limpa a pilha de navegação (evita que o usuário volte para cá)
              router.dismissAll();

              // 3. Atualiza o cache do pedido para refletir o novo status
              mutate(ordersKeys.detail(pedidoId));

              // 4. Redireciona para a tela de avaliação
              router.replace(`/(client)/(orders)/${pedidoId}/rating`);
            } catch (err) {
              Alert.alert(
                "Erro",
                "Não foi possível confirmar a conclusão do serviço.",
              );
              setIsConfirming(false);
            }
          },
        },
      ],
    );
  };
  const handleDispute = () => {
    setIsDisputing(true);
    // Navega para a tela de problema
    router.push(`/(client)/(orders)/${pedidoId}/issue`);
  };

  // Redireciona se o pedido já está em disputa (impede múltiplas contestações)
  if (pedido?.status === "EM_DISPUTA") {
    return <Redirect href={`/(client)/(orders)/${orderId}/issue/analysis`} />;
  }

  return (
    <OrderCompleteContent
      pedido={pedido}
      isLoading={isLoading}
      error={error}
      onBack={() => router.back()}
      onConfirm={handleConfirm}
      isConfirming={isConfirming}
      isDisputing={isDisputing}
      onDispute={handleDispute}
    />
  );
}
