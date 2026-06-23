// features/profile/types.ts

import type { StatusVerificacao } from "@/types/enums";

/** GET /api/v1/profissionais/perfil */
export interface PerfilProfissionalDTO {
  id: number;
  nome: string;
  foto?: string;
  fotoPerfil?: string;
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
  statusVerificacao?: StatusVerificacao;
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

/** Resposta da API GET /pedidos/historico/resumo */
export interface HistoricoResumoResponse {
  totalServicos: number;
  totalPago: number;
  mediaAvaliacoes: number;
}

/** Resposta da API GET /clientes/me */
export interface ClientePerfilResponse {
  nome: string;
  email: string;
  telefone: string;
  foto: string | null;
  cidade: string | null;
}

/** Request da API PUT /clientes/me */
export interface ClientePerfilRequest {
  nome: string;
  email: string;
  telefone: string;
  foto?: string | null;
}

// ---- Endereços ----

export type TipoEndereco = "CASA" | "TRABALHO" | "OUTRO";

export interface EnderecoResponse {
  id: number;
  tipo: TipoEndereco;
  apelido: string | null;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  padrao: boolean;
}

export interface EnderecoRequest {
  tipo: TipoEndereco;
  apelido?: string | null;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  uf: string;
}

export const TIPO_ENDERECO_LABEL: Record<TipoEndereco, string> = {
  CASA: "Casa",
  TRABALHO: "Trabalho",
  OUTRO: "Outro",
};

// ---- Configurações ----

export interface PreferenciasNotificacao {
  notificacoesPush: boolean;
  mensagensWhatsapp: boolean;
  emailsPromocionais: boolean;
}

export interface AtualizarSenhaRequest {
  senhaAtual: string;
  senhaNova: string;
  confirmacaoNovaSenha: string;
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
  statusVerificacao?: StatusVerificacao;
}

