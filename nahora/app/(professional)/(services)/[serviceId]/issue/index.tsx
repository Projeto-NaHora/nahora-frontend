import React, { useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { OrderIssueContent } from "@/features/orders/components/OrderIssueContent";

export default function ProReportarProblemaScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const router = useRouter();
  const idPedido = Number(serviceId);

  // Busca os dados do serviço
  const { data: pedido, isLoading } = useOrderDetail(idPedido);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (motivo: string, descricao: string) => {
    setIsSubmitting(true);

    try {
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert(
          "Suporte acionado",
          "Sua solicitação foi enviada para a nossa equipe. Entraremos em contato em breve.",
        );
        router.back();
      }, 1500);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível enviar o relato.");
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
