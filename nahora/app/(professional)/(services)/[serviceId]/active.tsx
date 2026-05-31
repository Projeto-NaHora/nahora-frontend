import React, { useState } from "react";
import { Alert } from "react-native";
import { mutate } from "swr";
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
              await orderService.concluirServico(pedidoId);

              mutate("/pedidos/meus-servicos");

              mutate(`/pedidos/${pedidoId}`);

              router.replace(`/(professional)/(services)/${pedidoId}/success`);
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
