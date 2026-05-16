import type { CategoriaServico } from "@/types/enums";

export interface ProfissionalResumo {
  id: number;
  nome: string;
  foto?: string;
  notaMedia: number;
  totalAvaliacoes: number;
  totalServicosExecutados: number;
  anosExperiencia?: number;
  bio?: string;
  especialidades?: string[];
  categoriasAtendidas?: CategoriaServico[];
  disponivel: boolean;
}

export interface Proposta {
  id: number;
  pedidoId: number;
  profissional: ProfissionalResumo;
  valor: number;
  descricao?: string;
  tempoEstimado?: string;
  status: "PENDENTE" | "ACEITA" | "REJEITADA" | "EXPIRADA";
  expiraEm?: string;
  criadoEm: string;
  atualizadoEm: string;
}