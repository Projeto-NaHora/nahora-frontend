import React, { useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { OrderDetailActiveContent } from "@/features/orders/components/OrderDetailActiveContent";
import { chatService } from "@/features/chat/service"; // Ajuste o caminho de importação se necessário

export default function PedidoEmAndamentoScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const pedidoId = Number(orderId);

  const { data: pedido, isLoading, error } = useOrderDetail(pedidoId);
  const [isOpeningChat, setIsOpeningChat] = useState(false);

  const handleChat = async () => {
    if (!pedido?.propostaId) {
      Alert.alert(
        "Erro",
        "Não foi possível encontrar a proposta deste serviço.",
      );
      return;
    }

    try {
      setIsOpeningChat(true);
      // Busca a conversa atrelada a esta proposta usando a sua API
      const conversa = await chatService.buscarPorProposta(pedido.propostaId);

      router.push(`/(client)/(chats)/${conversa.id}`);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível abrir o chat deste serviço.");
    } finally {
      setIsOpeningChat(false);
    }
  };

  const handleIssue = () => {
    router.push(`/(client)/(orders)/${pedidoId}/issue`);
  };

  return (
    <OrderDetailActiveContent
      pedido={pedido}
      isLoading={isLoading}
      error={error}
      onBack={() => router.back()}
      onChat={handleChat}
      onIssue={handleIssue}
      isOpeningChat={isOpeningChat} // Passando o novo estado para o botão
    />
  );
}
