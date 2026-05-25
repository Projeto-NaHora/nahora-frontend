import { useMemo } from "react";
import useSWR from "swr";
import { orderService } from "@/features/orders/service";
import type { Pedido, PedidoPublicoResponse } from "@/features/orders/types";

function mapPublicoToPedido(response: PedidoPublicoResponse): Pedido {
  return {
    id: response.id,
    clienteId: 0,
    clienteNome: response.clienteNome,
    categoria: response.categoria,
    descricao: response.descricao,
    fotos: response.fotos,
    endereco: {
      logradouro: "",
      numero: "",
      bairro: response.bairro,
      cidade: response.cidade,
    },
    urgencia: response.urgencia,
    orcamentoEstimado: response.orcamentoEstimado,
    dataDesejada: response.dataDesejada,
    status: response.status,
    criadoEm: response.criadoEm,
  };
}

export function usePedidoPublico(orderId: number) {
  const { data: response, error, isLoading } = useSWR(
    orderId ? `pedido-publico-${orderId}` : null,
    () => orderService.buscarPedidoPublico(orderId),
  );

  const pedido = useMemo(() => {
    if (!response) return undefined;
    return mapPublicoToPedido(response);
  }, [response]);

  return { pedido, isLoading, error } as const;
}
