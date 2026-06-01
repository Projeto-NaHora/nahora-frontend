import type { TagAvaliacao } from "@/types/enums";

/** Espelha AvaliacaoRequestDTO do backend */
export interface AvaliacaoRequest {
  nota: number; // 1-5
  comentario?: string; // max 500
  tags?: TagAvaliacao[];
}

/** Espelha AvaliacaoResponseDTO do backend */
export interface AvaliacaoResponse {
  id: number;
  pedidoId: number;
  avaliadorId: number;
  nomeAvaliador: string;
  nota: number;
  comentario: string | null;
  tags: TagAvaliacao[];
  editavel: boolean;
  criadoEm: string;
}

/** Define quais tags são mostradas para cada direção da avaliação */
export const TAGS_PARA_PROFISSIONAL: TagAvaliacao[] = [
  "PONTUAL",
  "CUIDADOSO",
  "LIMPO",
  "EDUCADO",
  "COMUNICATIVO",
];

export const TAGS_PARA_CLIENTE: TagAvaliacao[] = [
  "PONTUAL",
  "EDUCADO",
  "COMUNICATIVO",
  "PAGOU_EM_DIA",
  "LOCAL_ACESSIVEL",
];

/** Label em português para cada tag */
export const TAG_LABEL: Record<TagAvaliacao, string> = {
  PONTUAL: "Pontual",
  CUIDADOSO: "Cuidadoso",
  LIMPO: "Limpo",
  EDUCADO: "Educado",
  COMUNICATIVO: "Comunicativo",
  PAGOU_EM_DIA: "Pagou em dia",
  LOCAL_ACESSIVEL: "Local acessível",
};

/** Labels dinâmicos para cada nota */
export const NOTA_LABEL: Record<number, string> = {
  1: "Péssimo",
  2: "Ruim",
  3: "Regular",
  4: "Bom",
  5: "Excelente!",
};
