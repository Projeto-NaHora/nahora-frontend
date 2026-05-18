import { useMemo } from "react";
import { usePedidosDisponiveis, enrichWithMockData } from "./usePedidosDisponiveis";
import type { Pedido } from "@/features/orders/types";
import type { PedidoResumoResponse } from "../types";

function mapResumoToPedido(
  resumo: PedidoResumoResponse,
  clienteNome: string,
): Pedido {
  return {
    id: resumo.id,
    clienteId: 0,
    clienteNome,
    categoria: resumo.categoria,
    descricao: resumo.descricao,
    fotos: [],
    endereco: undefined,
    urgencia: resumo.urgente ? "URGENTE" : "NORMAL",
    orcamentoEstimado: undefined,
    dataDesejada: resumo.dataDesejada ?? "",
    status: "ABERTO",
    criadoEm: resumo.dataPublicacao,
  };
}

export function usePedidoResumoFromList(orderId: number) {
  const { pedidos, isLoading, error } = usePedidosDisponiveis();

  const pedido = useMemo(() => {
    if (!pedidos || pedidos.length === 0) return undefined;
    const resumo = pedidos.find((p) => p.id === orderId);
    if (!resumo) return undefined;
    const enriquecido = enrichWithMockData([resumo])[0];
    return mapResumoToPedido(resumo, enriquecido.clienteNome);
  }, [pedidos, orderId]);

  return {
    pedido,
    isLoading,
    error: pedido ? undefined : error,
  };
}
