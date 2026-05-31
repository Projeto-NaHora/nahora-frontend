import React, { useState } from "react";
import { Alert } from "react-native";
import { mutate } from "swr";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { orderService } from "@/features/orders/service";
import { OrderIssueContent } from "@/features/orders/components/OrderIssueContent";

export default function ProReportarProblemaScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const router = useRouter();
  const idPedido = Number(serviceId);

  const { data: pedido, isLoading } = useOrderDetail(idPedido);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (motivo: string, descricao: string) => {
    setIsSubmitting(true);

    try {
      // 1. Chama o backend
      await orderService.reportarProblema(idPedido);

      // 2. Invalida o cache para atualizar as cores e os status
      mutate("/pedidos/meus-servicos");
      mutate(`/pedidos/${idPedido}`);

      // 3. Exibe o alerta e volta para a aba "Serviços"
      Alert.alert(
        "Disputa Aberta",
        "Sua contestação foi registrada. Nossa equipe de suporte analisará a situação e entrará em contato em breve.",
        [
          {
            text: "Entendi",
            onPress: () => {
              // Limpa o histórico dessa tela e joga de volta pra lista raiz
              router.dismissAll();
              router.replace("/(professional)/(services)");
            },
          },
        ],
      );
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
