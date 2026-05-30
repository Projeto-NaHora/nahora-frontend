// features/profile/types.ts

export interface ProfileStats {
  servicesCount: number;
  rating: number;
  earnings: string;
}

export interface ProfileMenuItem {
  id: string;
  label: string;
  route?: string;
  isDanger?: boolean;
}

/** Resposta da API GET /profissionais/me */
export interface ProfessionalProfileResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  categoriaServico: string;
  cidade?: string;
  estado?: string;
  mediaAvaliacao?: number;
  totalServicos?: number;
  ganhos?: string;
  fotoUrl?: string;
  especialidades?: string[];
  anosExperiencia?: number;
  statusVerificacao?: string;
}

/** Profissional favorito retornado por GET /clientes/me/favoritos */
export interface FavoriteProfessional {
  id: number;
  nome: string;
  categoriaServico: string;
  cidade?: string;
  estado?: string;
  mediaAvaliacao?: number;
  totalAvaliacoes?: number;
  fotoUrl?: string;
}
