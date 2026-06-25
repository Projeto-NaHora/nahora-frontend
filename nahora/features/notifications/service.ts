// features/notifications/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { NotificacaoDTO } from "./types";

/** Espelha NotificacaoResponse (record) do backend */
interface BackendNotificacao {
  id: number;
  tipo: string;
  mensagem: string;
  lida: boolean;
  dataCriacao: string;
  destino?: { tipo: string; id: number } | null;
}

interface PaginatedResponse {
  content: BackendNotificacao[];
}

const TITULO_POR_TIPO: Record<string, string> = {
  NOVO_PEDIDO: "Novo pedido disponível",
  NOVA_PROPOSTA: "Proposta recebida",
  PROPOSTA_ACEITA: "Proposta aceita",
  NOVA_MENSAGEM: "Nova mensagem",
  SERVICO_CONCLUIDO: "Serviço concluído",
  PAGAMENTO_LIBERADO: "Pagamento liberado",
  DISPUTA_ABERTA: "Disputa aberta",
  AVALIACAO_RECEBIDA: "Avaliação recebida",
  VERIFICACAO_APROVADA: "Verificação aprovada",
};

function mapToDTO(item: BackendNotificacao): NotificacaoDTO {
  let dados: NotificacaoDTO["dados"];
  if (item.destino) {
    switch (item.destino.tipo) {
      case "PEDIDO":
        dados = { pedidoId: item.destino.id };
        break;
      case "CONVERSA":
        dados = { conversaId: item.destino.id };
        break;
      case "PROFISSIONAL":
      case "PERFIL":
        dados = { profissionalId: item.destino.id };
        break;
      case "DISPUTA":
        dados = { pedidoId: item.destino.id };
        break;
      default:
        dados = undefined;
    }
  }

  return {
    id: item.id,
    tipo: item.tipo as NotificacaoDTO["tipo"],
    titulo: TITULO_POR_TIPO[item.tipo] ?? "Notificação",
    mensagem: item.mensagem,
    lida: item.lida,
    criadaEm: item.dataCriacao,
    dados,
  };
}

export const notificationService = {
  async listar(): Promise<NotificacaoDTO[]> {
    const { data } = await api.get<PaginatedResponse>(ENDPOINTS.NOTIFICACOES);
    return (data.content ?? []).map(mapToDTO);
  },

  async marcarLida(id: number): Promise<void> {
    await api.put(ENDPOINTS.MARCAR_LIDA(id));
  },

  async marcarTodasLidas(): Promise<void> {
    await api.put(`${ENDPOINTS.NOTIFICACOES}/lidas`);
  },

  async limparTodas(): Promise<void> {
    await api.delete(ENDPOINTS.NOTIFICACOES);
  },
};
