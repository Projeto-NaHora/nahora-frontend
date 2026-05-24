// features/orders/types.ts
// DTOs que espelham o retorno do backend (Spring Boot)

import type { CategoriaServico, Urgencia } from "@/types/enums";

export interface EnderecoDTO {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep?: string;
}

export interface Pedido {
  id: number;
  clienteId: number;
  clienteNome: string;
  categoria: string;
  descricao: string;
  fotos: string[];
  endereco?: EnderecoDTO | null;
  urgencia: string;
  orcamentoEstimado?: number | null;
  dataDesejada: string;
  status: string;
  criadoEm: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/** Espelha com.nahora.dto.request.EnderecoRequest */
export interface EnderecoRequest {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  /** UF com 2 caracteres (ex.: "SP", "RJ") */
  estado: string;
  /** CEP com ou sem hifen (ex.: "12345678" ou "12345-678") */
  cep: string;
  latitude?: number;
  longitude?: number;
}

/** Espelha com.nahora.dto.request.PedidoRequest */
export interface CriarPedidoPayload {
  categoria: CategoriaServico;
  descricao: string;
  /** Indice do endereco salvo (preferivel a endereco quando ja existe) */
  enderecoSalvoIndex?: number;
  /** Objeto de endereco completo (usado quando enderecoSalvoIndex nao e informado) */
  endereco?: EnderecoRequest;
  /** URLs das fotos enviadas (maximo 5) */
  fotos?: string[];
  urgencia: Urgencia;
  orcamentoEstimado?: number;
  /** ISO datetime string (LocalDateTime no backend) */
  dataDesejada: string;
}

/** Valores do formulario de criacao de pedido */
export interface CriarPedidoFormValues {
  categoria: string;
  descricao: string;
  enderecoDiferente: boolean;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  urgencia: string;
  turno: string;
}

// Labels em português para exibição

export const CATEGORIA_LABEL: Record<string, string> = {
  ELETRICA: "Instalação elétrica",
  PEDREIRO: "Pedreiro",
  ENCANAMENTO: "Encanamento",
  PINTURA: "Pintura",
  MARCENARIA: "Marcenaria",
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
  MANHA: "Manha",
  TARDE: "Tarde",
  NOITE: "Noite",
};

export const TURNO_TIME_RANGES: Record<string, { startHour: number; endHour: number; label: string }> = {
  MANHA: { startHour: 8, endHour: 12, label: "Manhã" },
  TARDE: { startHour: 14, endHour: 18, label: "Tarde" },
  NOITE: { startHour: 19, endHour: 23, label: "Noite" },
};

export function getTurnoKey(iso: string | undefined | null): "MANHA" | "TARDE" | "NOITE" | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (isNaN(date.getTime())) return null;
  const hora = date.getHours();
  if (hora < 12) return "MANHA";
  if (hora < 18) return "TARDE";
  return "NOITE";
}

export const TURNO_OPTIONS = [
  { value: "MANHA", label: "Manha" },
  { value: "TARDE", label: "Tarde" },
  { value: "NOITE", label: "Noite" },
];

export const URGENCIA_LABEL: Record<string, string> = {
  BAIXA: "Baixa",
  NORMAL: "Normal",
  URGENTE: "Urgente",
};

export const URGENCIA_OPTIONS = [
  { value: "NORMAL", label: "Normal" },
  { value: "BAIXA", label: "Baixa" },
  { value: "URGENTE", label: "Urgente" },
];

/** UFs brasileiras — opcoes para o select de estado */
export const ESTADO_OPTIONS = [
  { value: "AC", label: "AC" },
  { value: "AL", label: "AL" },
  { value: "AP", label: "AP" },
  { value: "AM", label: "AM" },
  { value: "BA", label: "BA" },
  { value: "CE", label: "CE" },
  { value: "DF", label: "DF" },
  { value: "ES", label: "ES" },
  { value: "GO", label: "GO" },
  { value: "MA", label: "MA" },
  { value: "MT", label: "MT" },
  { value: "MS", label: "MS" },
  { value: "MG", label: "MG" },
  { value: "PA", label: "PA" },
  { value: "PB", label: "PB" },
  { value: "PR", label: "PR" },
  { value: "PE", label: "PE" },
  { value: "PI", label: "PI" },
  { value: "RJ", label: "RJ" },
  { value: "RN", label: "RN" },
  { value: "RS", label: "RS" },
  { value: "RO", label: "RO" },
  { value: "RR", label: "RR" },
  { value: "SC", label: "SC" },
  { value: "SP", label: "SP" },
  { value: "SE", label: "SE" },
  { value: "TO", label: "TO" },
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

/** Mapeia filtros da interface para valores do query param `status` do backend */
export const STATUS_FILTER_MAP: Record<FiltroStatus, string> = {
  TODOS: "",
  ABERTO: "ABERTO",
  EM_ANDAMENTO: "EM_ANDAMENTO,AGUARDANDO_VALIDACAO",
  CONCLUIDOS: "CONCLUIDO,CANCELADO,EM_DISPUTA",
};
