import { mapRawToProposta } from "@/features/proposals/service";
import type { PropostaResponseRaw } from "@/features/proposals/types";

const raw: PropostaResponseRaw = {
  id: 1,
  pedidoId: 42,
  profissionalId: 10,
  profissionalNome: "Carlos Almeida",
  profissionalFotoUrl: "https://example.com/foto.jpg",
  notaMedia: 4.8,
  numeroAvaliacoes: 42,
  totalServicosExecutados: 87,
  distancia: 2.4,
  localidade: "Recife, PE",
  especialidades: ["Eletricista"],
  valor: 150.0,
  descricao: "Posso fazer o servico amanha.",
  tempoEstimado: "2 horas",
  status: "PENDENTE",
  criadoEm: "2026-05-16T10:00:00Z",
  atualizadoEm: "2026-05-16T10:00:00Z",
};

describe("mapRawToProposta", () => {
  test("maps flat DTO to nested Proposta structure", () => {
    const result = mapRawToProposta(raw);

    expect(result.id).toBe(1);
    expect(result.pedidoId).toBe(42);
    expect(result.profissional).toBeDefined();
    expect(result.profissional.id).toBe(10);
    expect(result.profissional.nome).toBe("Carlos Almeida");
    expect(result.profissional.foto).toBe("https://example.com/foto.jpg");
    expect(result.profissional.notaMedia).toBe(4.8);
    expect(result.profissional.totalAvaliacoes).toBe(42);
    expect(result.profissional.totalServicosExecutados).toBe(87);
    expect(result.profissional.distancia).toBe(2.4);
    expect(result.profissional.localidade).toBe("Recife, PE");
    expect(result.profissional.especialidades).toEqual(["Eletricista"]);
    expect(result.valor).toBe(150.0);
    expect(result.descricao).toBe("Posso fazer o servico amanha.");
    expect(result.tempoEstimado).toBe("2 horas");
    expect(result.status).toBe("PENDENTE");
  });

  test("defaults profissional.id to 0 when missing", () => {
    const { profissionalId, ...without } = raw;
    const result = mapRawToProposta(without as PropostaResponseRaw);
    expect(result.profissional.id).toBe(0);
  });

  test("defaults pedidoId to 0 when missing", () => {
    const { pedidoId, ...without } = raw;
    const result = mapRawToProposta(without as PropostaResponseRaw);
    expect(result.pedidoId).toBe(0);
  });

  test("handles valorOferecido as fallback for valor", () => {
    const { valor, ...withoutValor } = raw;
    const withValorOferecido = { ...withoutValor, valorOferecido: 250.0 };
    const result = mapRawToProposta(withValorOferecido as PropostaResponseRaw);
    expect(result.valor).toBe(250.0);
  });

  test("defaults valor to 0 when both valor and valorOferecido missing", () => {
    const { valor, ...withoutValor } = raw;
    const result = mapRawToProposta(withoutValor as PropostaResponseRaw);
    expect(result.valor).toBe(0);
  });

  test("handles missing optional fields", () => {
    const minimal: PropostaResponseRaw = {
      id: 2,
      profissionalNome: "Joao Teste",
      notaMedia: 4.0,
      numeroAvaliacoes: 10,
      valor: 100.0,
      status: "PENDENTE",
      criadoEm: "2026-01-01T00:00:00Z",
      atualizadoEm: "2026-01-01T00:00:00Z",
    };
    const result = mapRawToProposta(minimal);

    expect(result.profissional.nome).toBe("Joao Teste");
    expect(result.profissional.foto).toBeUndefined();
    expect(result.profissional.distancia).toBeUndefined();
    expect(result.profissional.totalServicosExecutados).toBe(0);
    expect(result.descricao).toBeUndefined();
  });
});
