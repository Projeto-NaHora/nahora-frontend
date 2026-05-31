import React, { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { useProOrders } from "@/features/orders/hooks/useOrders";
import { ProServicesListContent } from "@/features/orders/components/ProServicesListContent";

export default function ProServicesTabScreen() {
  const router = useRouter();

  // 1. Extraímos a função 'refetch' do hook
  const { data, isLoading, mutate } = useProOrders();

  const pedidos = data?.content || data || [];

  // 2. Toda vez que o usuário abrir essa aba, forçamos a busca na API
  useFocusEffect(
    useCallback(() => {
      mutate();
    }, [mutate]),
  );

  const handleOpenDetails = (serviceId: number) => {
    router.push(`/(professional)/(services)/${serviceId}/active`);
  };

  const handleOpenChat = (propostaId: number) => {
    if (propostaId) {
      router.push(`/(professional)/(chats)/${propostaId}`);
    }
  };

  return (
    <ProServicesListContent
      pedidos={pedidos}
      isLoading={isLoading}
      onPressDetails={handleOpenDetails}
      onPressChat={handleOpenChat}
    />
  );
}
