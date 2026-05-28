// features/profile/types.ts

/** GET /api/v1/profissionais/perfil */
export interface PerfilProfissionalDTO {
  id: number;
  nome: string;
  foto?: string;
  profissao?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  bio?: string;
  categorias?: string[];
  especialidades?: string[];
  anosExperiencia?: number;
  raioAtuacaoKm?: number;
  notaMedia?: number;
  totalAvaliacoes?: number;
  totalServicosExecutados?: number;
  portfolio?: string[];
  disponivel?: boolean;
  statusVerificacao?: string;
}

/** PUT /api/v1/profissionais/perfil */
export interface ProfissionalPerfilRequest {
  nome?: string;
  email?: string;
  cpf?: string;
  celular?: string;
  fotoPerfil?: string;
  profissao?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  anosExperiencia?: number;
  bio?: string;
  especialidades?: string[];
  categorias?: string[];
  raioAtuacaoKm?: number;
  latitude?: number;
  longitude?: number;
  urlsFotosPortfolio?: string[];
}

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