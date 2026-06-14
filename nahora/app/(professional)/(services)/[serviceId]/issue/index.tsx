import React, { useState } from "react";
import { Alert } from "react-native";
import { mutate } from "swr";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { orderService } from "@/features/orders/service";
import { OrderIssueContent } from "@/features/orders/components/OrderIssueContent";

// 1. Definimos os motivos exclusivos do profissional
const MOTIVOS_PROFISSIONAL = [
  "O cliente não compareceu",
  "Cliente recusou o pagamento",
  "Condições do local diferentes do combinado",
  "Cliente cancelou ao chegar no local",
  "Acesso ao local negado",
  "Outro",
];

export default function ProReportarProblemaScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const router = useRouter();
  const idPedido = Number(serviceId);

  const { data: pedido, isLoading } = useOrderDetail(idPedido);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    motivoSelecionado: string,
    descricao: string,
    fotosUris: string[],
  ) => {
    setIsSubmitting(true);

    try {
      // 2. Upload das fotos para o MinIO
      const evidenciasUrls = await Promise.all(
        fotosUris.map(
          async (uri) => await orderService.uploadMidia(uri, "PEDIDO"), // Usando "PEDIDO" temporariamente até atualizar o Enum no Java
        ),
      );

      // 3. Converter texto amigável para o Enum do Java
      let motivoEnum = "OUTRO";
      switch (motivoSelecionado) {
        case "O cliente não compareceu":
          motivoEnum = "CLIENTE_NAO_COMPARECEU";
          break;
        case "Cliente recusou o pagamento":
          motivoEnum = "CLIENTE_RECUSOU_PAGAMENTO";
          break;
        case "Condições do local diferentes do combinado":
          motivoEnum = "CONDICOES_DIFERENTES_DO_COMBINADO";
          break;
        case "Cliente cancelou ao chegar no local":
          motivoEnum = "CLIENTE_CANCELOU_NO_LOCAL";
          break;
        case "Acesso ao local negado":
          motivoEnum = "ACESSO_AO_LOCAL_NEGADO";
          break;
        default:
          motivoEnum = "OUTRO";
      }

      // 4. Chamada real à API
      await orderService.reportarProblema(idPedido, {
        motivo: motivoEnum,
        descricao,
        evidencias: evidenciasUrls,
      });

      // 5. Invalida o cache para atualizar a lista de serviços do profissional
      mutate("/pedidos/meus-servicos");
      mutate(`/pedidos/${idPedido}`);

      // 6. Redireciona para a tela de sucesso (reported.tsx)
      router.replace(`/(professional)/(services)/${idPedido}/issue/reported`);
    } catch (err) {
      Alert.alert(
        "Erro",
        "Não foi possível enviar a denúncia. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OrderIssueContent
      pedido={pedido}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      motivosDisponiveis={MOTIVOS_PROFISSIONAL} // Passamos a lista correta aqui!
      onBack={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}
