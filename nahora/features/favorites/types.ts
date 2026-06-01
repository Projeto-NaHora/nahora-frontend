// features/favorites/types.ts

/** Resposta de GET /api/v1/profissionais/{profissionalId}/favoritado */
export interface FavoritoStatusResponse {
  favoritado: boolean;
}

/** DTO do backend: FavoritoResponseDTO */
export interface FavoritoResponseDTO {
  profissionalId: number;
  nomeProfissional: string;
  fotoProfissional: string;
  mediaAvaliacao: number;
  totalAvaliacoes: number;
  categorias: string[];
  favoritadoEm: string; // ISO-8601 (LocalDateTime)
}

/** Spring Page wrapper */
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
