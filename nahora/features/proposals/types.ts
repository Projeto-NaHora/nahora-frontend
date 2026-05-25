import type { CategoriaServico } from "@/types/enums";

export interface ProfissionalResumo {
  id: number;
  nome: string;
  foto?: string;
  notaMedia: number;
  totalAvaliacoes: number;
  totalServicosExecutados: number;
  anosExperiencia?: number;
  distancia?: number;
  localidade?: string;
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
  horariosDisponiveis?: HorarioSlot[];
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface HorarioSlot {
  inicio: string;
  fim: string;
  data?: string;
  excecao?: boolean;
}

export interface CriarPropostaPayload {
  valorOferecido: number;
  descricao?: string;
  horariosDisponiveis: HorarioSlot[];
}

export interface PropostaResponseRaw {
  id: number;
  pedidoId?: number;
  profissionalId?: number;
  profissionalNome?: string;
  profissionalFotoUrl?: string;
  notaMedia?: number;
  numeroAvaliacoes?: number;
  totalServicosExecutados?: number;
  distancia?: number;
  localidade?: string;
  especialidades?: string[];
  valor?: number;
  valorOferecido?: number;
  descricao?: string;
  tempoEstimado?: string;
  status: "PENDENTE" | "ACEITA" | "REJEITADA" | "EXPIRADA";
  expiraEm?: string;
  horariosDisponiveis?: HorarioSlot[];
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface AceitarPropostaResponseDTO {
  pedidoId: number;
  status: string;
  profissionalId: number;
  profissionalNome: string;
}

export interface CriarPropostaFormValues {
  valorOferecido: string;
  descricao: string;
}

export type HorarioModalStep = "idle" | "date" | "start_time" | "end_time" | "confirm";

export interface HorarioModalState {
  step: HorarioModalStep;
  selectedDate: Date | null;
  selectedStart: Date | null;
  selectedEnd: Date | null;
  editingIndex: number | null;
}