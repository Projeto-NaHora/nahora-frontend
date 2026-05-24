import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePedidoResumoFromList } from "@/features/professional/hooks/usePedidoResumoFromList";
import { ProfessionalOrderDetailContent } from "@/features/orders/components/ProfessionalOrderDetailContent";

export default function ProfessionalOrderDetailScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const { pedido, isLoading, error } = usePedidoResumoFromList(Number(orderId));

  return (
    <ProfessionalOrderDetailContent
      pedido={pedido}
      isLoading={isLoading}
      error={error}
      onBack={() => router.back()}
      onVerPerfil={
        pedido?.clienteId
          ? () =>
              router.push(
                `/(professional)/(orders)/${orderId}/client/${pedido.clienteId}`,
              )
          : undefined
      }
      onMostrarInteresse={() =>
        router.push(`/(professional)/(orders)/${orderId}/proposal`)
      }
    />
  );
}
