import type { ProfissionalResumo, Proposta, HorarioSlot } from "@/features/proposals/types";

export function createMockProfissionalResumo(
  overrides?: Partial<ProfissionalResumo>,
): ProfissionalResumo {
  return {
    id: 1,
    nome: "Carlos Almeida",
    foto: undefined,
    notaMedia: 4.8,
    totalAvaliacoes: 42,
    totalServicosExecutados: 87,
    distancia: 1.2,
    localidade: "Recife, PE",
    especialidades: ["Eletricista"],
    disponivel: true,
    ...overrides,
  };
}

export function createMockProposta(
  overrides?: Partial<Proposta>,
): Proposta {
  return {
    id: 1,
    pedidoId: 1,
    profissional: createMockProfissionalResumo(),
    valor: 150.0,
    descricao: "Posso fazer o serviço amanhã pela manhã.",
    tempoEstimado: "2 horas",
    status: "PENDENTE",
    criadoEm: "2026-05-16T10:00:00Z",
    atualizadoEm: "2026-05-16T10:00:00Z",
    ...overrides,
  };
}

export function createMockPropostaList(count = 3): Proposta[] {
  return Array.from({ length: count }, (_, i) =>
    createMockProposta({
      id: i + 1,
      profissional: createMockProfissionalResumo({
        id: i + 1,
        nome: `Profissional ${i + 1}`,
        notaMedia: 4.5 + i * 0.2,
      }),
      valor: 100 + i * 50,
      tempoEstimado: `${(i + 1) * 2} horas`,
    }),
  );
}

export function createMockHorarioSlot(
  overrides?: Partial<HorarioSlot>,
): HorarioSlot {
  return {
    inicio: "2026-06-06T08:00:00",
    fim: "2026-06-06T10:00:00",
    ...overrides,
  };
}

export function createMockHorarioSlotList(count = 2): HorarioSlot[] {
  const slots: HorarioSlot[] = [
    createMockHorarioSlot({ inicio: "2026-06-06T08:00:00", fim: "2026-06-06T10:00:00" }),
    createMockHorarioSlot({ inicio: "2026-06-07T14:00:00", fim: "2026-06-07T16:00:00" }),
  ];
  return slots.slice(0, count);
}
