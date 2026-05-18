import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { OrderSuccessContent } from "@/features/orders/components/OrderSuccessContent";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string | string[] }>();

  const orderIdParam = Array.isArray(orderId) ? orderId[0] : orderId;
  const parsedId = Number(orderIdParam);
  const safeId = Number.isFinite(parsedId) ? parsedId : 0;

  const { data: pedido, isLoading, error } = useOrderDetail(safeId);

  const handleTrackOrder = () => {
    if (safeId) {
      router.push(`/(client)/(orders)/${safeId}`);
      return;
    }
    router.push("/(client)/(orders)");
  };

  return (
    <OrderSuccessContent
      pedido={pedido}
      isLoading={isLoading}
      error={error}
      onBack={() => router.back()}
      onTrackOrder={handleTrackOrder}
    />
  );
}
