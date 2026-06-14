// features/notifications/types.ts
import type { TipoNotificacao } from "@/types/enums";

export interface NotificacaoDTO {
  id: number;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  lida: boolean;
  criadaEm: string; // ISO 8601
  dados?: {
    pedidoId?: number;
    propostaId?: number;
    conversaId?: number;
    profissionalId?: number;
  };
}

export interface NotificacoesAgrupadas {
  secao: string;
  notificacoes: NotificacaoDTO[];
}