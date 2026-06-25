import React, { useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { orderService } from "@/features/orders/service";
import { ordersKeys } from "@/features/orders/types";
import { mutate } from "swr";
import { OrderIssueContent } from "@/features/orders/components/OrderIssueContent";

const MOTIVOS_CLIENTE = [
  "Serviço não foi executado conforme combinado",
  "O profissional não compareceu",
  "Qualidade insatisfatória",
  "Cobrou valor diferente",
  "Outro",
];

export default function ReportarProblemaScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const idPedido = Number(orderId);

  const { data: pedido, isLoading } = useOrderDetail(idPedido);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    motivoSelecionado: string,
    descricao: string,
    fotosUris: string[],
  ) => {
    setIsSubmitting(true);

    try {
      // 1. Faz upload das fotos locais para obter as URLs do servidor
      const evidenciasUrls = await Promise.all(
        fotosUris.map(async (uri) => {
          return await orderService.uploadMidia(uri, "EVIDENCIA_DISPUTA");
        }),
      );

      // 2. Converte o texto amigável do app para o ENUM que o Java espera
      // Converte o texto amigável do app para o ENUM que o Java espera
      let motivoEnum = "OUTRO";
      switch (motivoSelecionado) {
        case "Serviço não foi executado conforme combinado":
          // 👇 A correção exata é nesta linha:
          motivoEnum = "SERVICO_NAO_EXECUTADO_CONFORME_COMBINADO";
          break;
        case "O profissional não compareceu":
          motivoEnum = "PROFISSIONAL_NAO_COMPARECEU";
          break;
        case "Qualidade insatisfatória":
          motivoEnum = "QUALIDADE_INSATISFATORIA";
          break;
        case "Cobrou valor diferente":
          motivoEnum = "COBROU_VALOR_DIFERENTE";
          break;
        default:
          motivoEnum = "OUTRO";
      }
      // 3. AGORA SIM: Passamos o objeto payload com todos os dados!
      await orderService.reportarProblema(idPedido, {
        motivo: motivoEnum,
        descricao: descricao,
        evidencias: evidenciasUrls,
      });

      // Invalida o cache para atualizar a lista
      mutate(ordersKeys.list());
      mutate(ordersKeys.detail(idPedido));

      // Redireciona direto para a tela de Sucesso (C102)
      router.replace(`/(client)/(orders)/${idPedido}/issue/success`);
    } catch (err) {
      Alert.alert(
        "Erro",
        "Não foi possível enviar a denúncia. Tente novamente.",
      );
    }
    setIsSubmitting(false);
  };

  return (
    <OrderIssueContent
      pedido={pedido}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      motivosDisponiveis={MOTIVOS_CLIENTE}
      onBack={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}
