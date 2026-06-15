import React from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DisputeAnalysisContent } from "@/features/orders/components/DisputeAnalysisContent";
import { useDisputaStatus } from "@/features/orders/hooks/useOrders";

export default function DisputeScreen() {
  const router = useRouter();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();

  // Busca os dados da disputa do backend
  const { disputa, isLoading } = useDisputaStatus(Number(serviceId));

  const handleGoHome = () => {
    router.dismissAll();
    router.replace("/(professional)/(services)");
  };

  const handleViewDecision = () => {
    if (!disputa?.decisao) return;

    // Roteamento inteligente baseado no resultado do backend
    if (disputa.decisao.resultado === "FAVORAVEL_CLIENTE") {
      router.push(
        `/(professional)/(services)/${serviceId}/issue/resolution-client`,
      );
    } else {
      router.push(
        `/(professional)/(services)/${serviceId}/issue/resolution-provider`,
      );
    }
  };

  if (isLoading || !disputa) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF",
        }}
      >
        <ActivityIndicator size="large" color="#F26F21" />
      </View>
    );
  }

  // Mapeamento do status Java para o Frontend
  let statusConvertido:
    | "ANALISANDO_EVIDENCIAS"
    | "DECISAO_TOMADA"
    | "ENCERRADA" = "ANALISANDO_EVIDENCIAS";
  if (disputa.status === "DECIDIDA") {
    statusConvertido = "DECISAO_TOMADA";
  } else if (disputa.status === "ENCERRADA") {
    statusConvertido = "ENCERRADA";
  }

  const dataDenuncia = disputa.etapas?.[0]?.descricao || "Recente";

  return (
    <DisputeAnalysisContent
      protocolo={disputa.numeroDisputa}
      dataDenuncia={dataDenuncia}
      statusDisputa={statusConvertido}
      onBack={() => router.back()}
      onGoHome={handleGoHome}
      onViewDecision={handleViewDecision}
    />
  );
}
