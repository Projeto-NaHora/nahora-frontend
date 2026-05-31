import React, { useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { orderService } from "@/features/orders/service";
import { ProOrderDetailActiveContent } from "@/features/orders/components/ProOrderDetailActiveContent";

export default function ProActiveOrderScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const router = useRouter();
  const pedidoId = Number(serviceId);

  const { data: pedido, isLoading } = useOrderDetail(pedidoId);
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = () => {
    Alert.alert(
      "Finalizar Serviço?",
      "Tem certeza que deseja marcar este serviço como concluído? O cliente será notificado para aprovação.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, finalizar",
          onPress: async () => {
            setIsFinishing(true);
            try {
              // Chama o Spring Boot para mudar o status
              await orderService.concluirServico(pedidoId);

              // Navega para a tela de sucesso
              router.push(`/(professional)/(orders)/${pedidoId}/success`);
            } catch (err) {
              Alert.alert(
                "Erro",
                "Não foi possível finalizar o serviço. Tente novamente.",
              );
              setIsFinishing(false);
            }
          },
        },
      ],
    );
  };

  const handleIssue = () => {
    // Corrigido para apontar para a pasta de (services) e usar o serviceId
    router.push(`/(professional)/(services)/${serviceId}/issue`);
  };

  return (
    <ProOrderDetailActiveContent
      pedido={pedido}
      isLoading={isLoading}
      isFinishing={isFinishing}
      onBack={() => router.back()}
      onIssue={handleIssue}
      onFinish={handleFinish}
    />
  );
}
