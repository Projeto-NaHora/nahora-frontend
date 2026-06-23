import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DisputeAnalysisContent } from "@/features/orders/components/DisputeAnalysisContent";
import { useDisputaStatus } from "@/features/orders/hooks/useOrders"; // Importe o novo hook

export default function DisputeAnalysisScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const { disputa, isLoading } = useDisputaStatus(Number(orderId));

  const handleGoHome = () => {
    router.dismissAll();
    router.replace("/(client)/(home)");
  };

  const handleViewDecision = () => {
    router.push(`/(client)/(orders)/${orderId}/issue/decision`);
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

  // Mapeia o status do Java para o status esperado pelo componente visual
  // O Java retorna: EM_ANALISE, EM_CONTESTACAO, DECIDIDA, ENCERRADA
  let statusConvertido:
    | "ANALISANDO_EVIDENCIAS"
    | "DECISAO_TOMADA"
    | "ENCERRADA" = "ANALISANDO_EVIDENCIAS";

  if (disputa.status === "DECIDIDA") {
    statusConvertido = "DECISAO_TOMADA";
  } else if (disputa.status === "ENCERRADA") {
    statusConvertido = "ENCERRADA";
  }

  // Pegamos a data da primeira etapa (Denúncia recebida) para exibir no topo
  const dataDenuncia =
    disputa.etapas && disputa.etapas.length > 0
      ? disputa.etapas[0].descricao
      : "";

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
