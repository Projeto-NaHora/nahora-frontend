import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { ProOrderDetailActiveContent } from "@/features/orders/components/ProOrderDetailActiveContent";

export default function ProActiveOrderScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const router = useRouter();
  const pedidoId = Number(serviceId);

  const { data: pedido, isLoading } = useOrderDetail(pedidoId);
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = () => {
    // Navigate to completion screen where user uploads media before finishing
    router.push(`/(professional)/(services)/${serviceId}/completion`);
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
