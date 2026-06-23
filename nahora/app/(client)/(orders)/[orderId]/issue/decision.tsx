import React from "react";
import { ActivityIndicator, View, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DisputeDecisionContent } from "@/features/orders/components/DisputeDecisionContent";
import { useDisputaStatus } from "@/features/orders/hooks/useOrders";
import { disputaService } from "@/features/orders/service"; // Importe o serviço

export default function DisputeDecisionScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const { disputa, isLoading, mutate } = useDisputaStatus(Number(orderId));

  const handleGoHome = () => {
    router.dismissAll();
    router.replace("/(client)/(home)");
  };

  const handleContest = async () => {
    try {
      await disputaService.contestar(
        disputa.disputaId,
        "Solicito revisão da decisão.",
        [],
      );

      Alert.alert("Sucesso", "Sua contestação foi enviada para revisão.");
      mutate();
      router.back();
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível contestar a decisão. Verifique o prazo de 24h.",
      );
    }
  };

  const handlePay = () => {
    router.push(`/(client)/(orders)/${orderId}/payment`);
  };

  if (isLoading || !disputa || !disputa.decisao) {
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

  const decisao = disputa.decisao;

  const isFavorableToClient = decisao.resultado === "FAVORAVEL_CLIENTE";

  // Formata o valor monetário corretamente dependendo de quem ganhou
  const valorExibicao = isFavorableToClient
    ? `R$ ${decisao.valorReembolsado?.toFixed(2).replace(".", ",") || "0,00"}`
    : `R$ ${decisao.valorCobrado?.toFixed(2).replace(".", ",") || "0,00"}`;

  // Formata a data
  const dataDecisaoFormatada = disputa.etapas[2]?.descricao || "Recente";

  return (
    <DisputeDecisionContent
      isFavorableToClient={disputa.decisao.resultado === "FAVORAVEL_CLIENTE"}
      valor={`R$ ${decisao.valorCobrado?.toFixed(2).replace(".", ",") || "0,00"}`}
      dataDecisao={disputa.etapas?.[2]?.descricao || "Hoje"}
      descricaoResultado={disputa.decisao.descricaoResultado}
      onGoHome={handleGoHome}
      onContest={handleContest}
    />
  );
}
