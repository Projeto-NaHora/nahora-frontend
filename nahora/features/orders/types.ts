// features/orders/types.ts
// DTOs que espelham o retorno do backend (Spring Boot)

export interface EnderecoDTO {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep?: string;
}

export interface ProfissionalDTO {
  id: number;
  nome: string;
  avatarUrl?: string;
}

export interface Pedido {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  urgencia: string;
  status: string;
  clienteId: number;
  profissionalId?: number | null;
  profissional?: ProfissionalDTO | null;
  endereco?: EnderecoDTO | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CriarPedidoPayload {
  titulo: string;
  descricao: string;
  categoria: string;
  urgencia: string;
  enderecoId: number;
  /** URLs das imagens/vídeos enviadas pelo upload */
  midias?: string[];
}

export interface CriarPedidoFormValues {
  categoria: string;
  descricao: string;
  enderecoDiferente: boolean;
  enderecoId?: number;
  turno: string;
}

// Labels em português para exibição

export const CATEGORIA_LABEL: Record<string, string> = {
  ELETRICA: "Instalação elétrica",
  PEDREIRO: "Pedreiro",
  ENCANAMENTO: "Encanamento",
  PINTURA: "Pintura",
  AR_CONDICIONADO: "Ar-condicionado",
};

export const STATUS_LABEL: Record<string, string> = {
  ABERTO: "Em aberto",
  EM_ANDAMENTO: "Em andamento",
  AGUARDANDO_VALIDACAO: "Aguardando validação",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  EM_DISPUTA: "Em disputa",
};

export const TURNO_LABEL: Record<string, string> = {
  MANHA: "Manhã",
  TARDE: "Tarde",
  NOITE: "Noite",
};

export const TURNO_OPTIONS = [
  { value: "MANHA", label: "Manhã" },
  { value: "TARDE", label: "Tarde" },
  { value: "NOITE", label: "Noite" },
];

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  ABERTO: { bg: "#FEF0E8", text: "#F26F21" },
  EM_ANDAMENTO: { bg: "#E6F0FF", text: "#417BE0" },
  AGUARDANDO_VALIDACAO: { bg: "#FFF3CD", text: "#856404" },
  CONCLUIDO: { bg: "#E2F6ED", text: "#1AAE6F" },
  CANCELADO: { bg: "#F5F5F5", text: "#8E8E93" },
  EM_DISPUTA: { bg: "#FDE8E8", text: "#DC2626" },
};

/** Filtros disponíveis na tela */
export type FiltroStatus = "TODOS" | "ABERTO" | "EM_ANDAMENTO" | "CONCLUIDOS";

export const FILTRO_OPTIONS: { value: FiltroStatus; label: string }[] = [
  { value: "TODOS", label: "Todos" },
  { value: "ABERTO", label: "Em aberto" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "CONCLUIDOS", label: "Concluídos" },
];
