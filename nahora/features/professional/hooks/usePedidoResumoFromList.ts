import { useMemo } from "react";
import { usePedidosDisponiveis } from "./usePedidosDisponiveis";
import type { Pedido } from "@/features/orders/types";
import type { PedidoDisponivelResponse } from "../types";

function mapDisponivelToPedido(
  disponivel: PedidoDisponivelResponse,
): Pedido {
  return {
    id: disponivel.id,
    clienteId: 0,
    clienteNome: disponivel.nomeCliente,
    categoria: disponivel.categoria,
    descricao: disponivel.titulo,
    fotos: [],
    endereco: undefined,
    urgencia: "NORMAL",
    orcamentoEstimado: undefined,
    dataDesejada: "",
    status: disponivel.statusPedido,
    criadoEm: disponivel.criadoEm,
  };
}

export function usePedidoResumoFromList(orderId: number) {
  const { pedidos, isLoading, error } = usePedidosDisponiveis();

  const pedido = (() => {
    if (!pedidos || pedidos.length === 0) return undefined;
    const disponivel = pedidos.find((p) => p.id === orderId);
    if (!disponivel) return undefined;
    return mapDisponivelToPedido(disponivel);
  })();

  return {
    pedido,
    isLoading,
    error: pedido ? undefined : error,
  };
}
