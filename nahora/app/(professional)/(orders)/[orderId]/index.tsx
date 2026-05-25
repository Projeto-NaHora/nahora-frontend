import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePedidoPublico } from "@/features/professional/hooks/usePedidoPublico";
import { ProfessionalOrderDetailContent } from "@/features/orders/components/ProfessionalOrderDetailContent";

export default function ProfessionalOrderDetailScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const { pedido, isLoading, error } = usePedidoPublico(Number(orderId));

  return (
    <ProfessionalOrderDetailContent
      pedido={pedido}
      isLoading={isLoading}
      error={error}
      onBack={() => router.back()}
      onMostrarInteresse={() =>
        router.push(`/(professional)/(orders)/${orderId}/proposal`)
      }
    />
  );
}
