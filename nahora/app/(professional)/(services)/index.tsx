import React, { useState } from "react";
import { useRouter } from "expo-router";
import { ProServicesListContent } from "@/features/orders/components/ProServicesListContent";

// === DADOS MOCKADOS PARA TESTE ===
// Quando o endpoint estiver pronto, basta apagar isso e voltar a usar o hook useProOrders()
const MOCK_SERVICOS = [
  {
    id: 101,
    status: "EM_ANDAMENTO",
    categoria: "Instalação elétrica residencial",
    orcamentoEstimado: 150.0,
    dataDesejada: "2026-04-20T14:00:00",
    clienteNome: "Maria Silva",
    propostaAceitaId: 501, // ID fictício para o chat
  },
  {
    id: 102,
    status: "CONFIRMADO",
    categoria: "Conserto de chuveiro elétrico",
    orcamentoEstimado: 90.0,
    dataDesejada: "2026-04-21T09:00:00",
    clienteNome: "Roberto Barbosa",
    propostaAceitaId: 502,
  },
  {
    id: 103,
    status: "CONFIRMADO",
    categoria: "Troca de fiação geral",
    orcamentoEstimado: 450.0,
    dataDesejada: "2026-04-24T10:30:00",
    clienteNome: "Ana Beatriz",
    propostaAceitaId: 503,
  },
];

export default function ProServicesTabScreen() {
  const router = useRouter();

  const isLoading = false;
  const pedidos = MOCK_SERVICOS;

  const handleOpenDetails = (serviceId: number) => {
    // Vai para a tela de Detalhes do Serviço (active.tsx)
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
