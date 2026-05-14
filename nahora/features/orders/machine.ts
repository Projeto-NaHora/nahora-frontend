// features/orders/machine.ts
import type { StatusPedido } from "@/types/enums";

// Mapa de quais ações são permitidas em cada status
export const TRANSICOES_PEDIDO: Record<StatusPedido, StatusPedido[]> = {
  ABERTO: ["EM_ANDAMENTO", "CANCELADO"],
  EM_ANDAMENTO: ["AGUARDANDO_VALIDACAO"],
  AGUARDANDO_VALIDACAO: ["CONCLUIDO", "EM_DISPUTA"],
  CONCLUIDO: [],
  CANCELADO: [],
  EM_DISPUTA: ["CONCLUIDO", "CANCELADO"],
};

export function podeTransicionar(
  atual: StatusPedido,
  proximo: StatusPedido,
): boolean {
  return TRANSICOES_PEDIDO[atual].includes(proximo);
}
