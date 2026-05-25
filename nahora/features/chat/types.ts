import type { StatusConversa, StatusMensagem, TipoUsuario } from "@/types/enums";

export interface Mensagem {
  id: number;
  conversaId: number;
  remetenteId: number;
  nomeRemetente: string;
  conteudo: string;
  anexoUrl: string | null;
  status: StatusMensagem;
  bloqueadaIa: boolean;
  criadoEm: string;
  tipoRemetente: TipoUsuario;
}

export interface ConversaResponseDTO {
  id: number;
  pedidoId: number;
  propostaId: number;
  status: StatusConversa;
  criadoEm: string;
  tituloPedido: string;
  categoriaPedido: string;
  nomeOutroParticipante: string;
  fotoOutroParticipante: string | null;
  statusProposta?: string;
  valorProposta?: number;
  ultimaMensagem?: string;
  ultimaMensagemEnviadaEm?: string;
}

export interface MensagemPage {
  content: Mensagem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface DateSeparatorEntry {
  __type: "date-separator";
  date: string;
}

export type MessageListItem = Mensagem | DateSeparatorEntry;

// ---- Filtros ----

export type FiltroConversaStatus = "TODAS" | "ABERTA" | "FECHADA";

export const STATUS_FILTER_MAP: Record<FiltroConversaStatus, string> = {
  TODAS: "ABERTA,SOMENTE_LEITURA,EM_DISPUTA,FECHADA",
  ABERTA: "ABERTA,EM_DISPUTA",
  FECHADA: "SOMENTE_LEITURA,FECHADA",
};

export const FILTRO_OPTIONS: { value: FiltroConversaStatus; label: string }[] = [
  { value: "TODAS", label: "Todas" },
  { value: "ABERTA", label: "Abertas" },
  { value: "FECHADA", label: "Encerradas" },
];

// ---- Labels de status ----

export const CONVERSA_STATUS_LABEL: Record<string, string> = {
  ABERTA: "Aberta",
  SOMENTE_LEITURA: "Leitura",
  EM_DISPUTA: "Em disputa",
  FECHADA: "Encerrada",
};

export const CONVERSA_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  ABERTA: { bg: "#E2F6ED", text: "#1AAE6F" },
  SOMENTE_LEITURA: { bg: "#E6F0FF", text: "#417BE0" },
  EM_DISPUTA: { bg: "#FDE8E8", text: "#DC2626" },
  FECHADA: { bg: "#F5F5F5", text: "#8E8E93" },
};
