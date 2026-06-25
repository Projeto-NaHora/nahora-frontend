// __tests__/chat/validation.test.ts
import {
  validarMensagem,
  __test,
} from "@/features/chat/validation";

const { contemTelefone, contemPalavrao, normalizarParaDigitos, normalizarSemAcento } = __test;

// ── normalizarParaDigitos ──────────────────────────────────────────

describe("normalizarParaDigitos", () => {
  test("remove espaços, parênteses, hífens, pontos e +", () => {
    expect(normalizarParaDigitos("(81) 9 9482-2177")).toBe("81994822177");
    expect(normalizarParaDigitos("+55 81 994822177")).toBe("5581994822177");
    expect(normalizarParaDigitos("81 9 94822177")).toBe("81994822177");
    expect(normalizarParaDigitos("99482-2177")).toBe("994822177");
  });

  test("mantém texto sem formatação inalterado", () => {
    expect(normalizarParaDigitos("81994822177")).toBe("81994822177");
    expect(normalizarParaDigitos("Ola, tudo bem?")).toBe("Ola,tudobem?");
  });
});

// ── normalizarSemAcento ───────────────────────────────────────────

describe("normalizarSemAcento", () => {
  test("remove acentos e converte para lowercase", () => {
    expect(normalizarSemAcento("palavrão")).toBe("palavrao");
    expect(normalizarSemAcento("PALAVRÃO")).toBe("palavrao");
    expect(normalizarSemAcento("você é incrível")).toBe("voce e incrivel");
  });

  test("mantém texto sem acento inalterado (só lowercase)", () => {
    expect(normalizarSemAcento("palavrao")).toBe("palavrao");
    expect(normalizarSemAcento("TEXTO")).toBe("texto");
  });
});

// ── contemTelefone ────────────────────────────────────────────────

describe("contemTelefone", () => {
  describe("formatos comuns (com separadores)", () => {
    test("(XX) XXXXX-XXXX", () => {
      expect(contemTelefone("(81) 99482-2177")).toBe(true);
    });

    test("(XX) XXXX-XXXX (fixo)", () => {
      expect(contemTelefone("(81) 3482-2177")).toBe(true);
    });

    test("+55 (XX) XXXXX-XXXX", () => {
      expect(contemTelefone("+55 (81) 99482-2177")).toBe(true);
    });

    test("+55 XX 9XXXX-XXXX", () => {
      expect(contemTelefone("+55 81 99482-2177")).toBe(true);
    });

    test("XXXX-XXXX (mínimo)", () => {
      expect(contemTelefone("99482-2177")).toBe(true);
    });

    test("XX X XXXX-XXXX (com espaços)", () => {
      expect(contemTelefone("81 9 9482-2177")).toBe(true);
    });
  });

  describe("sequência nua de dígitos (8 a 13 consecutivos)", () => {
    test("11 dígitos sem formatação", () => {
      expect(contemTelefone("81994822177")).toBe(true);
    });

    test("10 dígitos sem formatação (fixo com DDD)", () => {
      expect(contemTelefone("8134822177")).toBe(true);
    });

    test("9 dígitos sem formatação (celular sem DDD)", () => {
      expect(contemTelefone("994822177")).toBe(true);
    });

    test("8 dígitos (fixo sem DDD)", () => {
      expect(contemTelefone("34822177")).toBe(true);
    });

    test("+55 prefix com 11 dígitos", () => {
      expect(contemTelefone("+5581994822177")).toBe(true);
    });

    test("telefone no meio de frase", () => {
      expect(contemTelefone("Me liga no 81 99482-2177 amanhã")).toBe(true);
    });

    test("telefone com espaços irregulares", () => {
      expect(contemTelefone("81  9  9482  2177")).toBe(true);
    });
  });

  describe("não dispara em falsos positivos", () => {
    test("CEP de 8 dígitos começando com 0", () => {
      expect(contemTelefone("01310100")).toBe(false);
    });

    test("valor monetário com 7 dígitos ou menos", () => {
      expect(contemTelefone("R$ 1500,00")).toBe(false);
    });

    test("frase normal sem números de telefone", () => {
      expect(contemTelefone("Olá, tudo bem? Podemos agendar para amanhã?")).toBe(false);
    });

    test("número pequeno em texto", () => {
      expect(contemTelefone("são 3 opções disponíveis")).toBe(false);
    });
  });
});

// ── contemPalavrao ────────────────────────────────────────────────

describe("contemPalavrao", () => {
  describe("detecta palavrões com acento", () => {
    test("palavrão isolado", () => {
      expect(contemPalavrao("caralho")).toBe(true);
      expect(contemPalavrao("porra")).toBe(true);
    });

    test("palavrão no meio de frase", () => {
      expect(contemPalavrao("Você é um otário mesmo")).toBe(true);
    });
  });

  describe("detecta palavrões sem acento (variação)", () => {
    test("palavra sem acento onde normalmente tem", () => {
      expect(contemPalavrao("otario")).toBe(true);
      expect(contemPalavrao("desgracado")).toBe(true);
    });

    test("frase com palavra sem acento", () => {
      expect(contemPalavrao("voce e um babaca")).toBe(true);
    });
  });

  describe("não dispara em falsos positivos", () => {
    test("frase normal", () => {
      expect(contemPalavrao("Olá, bom dia!")).toBe(false);
      expect(contemPalavrao("Podemos conversar sobre o serviço?")).toBe(false);
    });

    test("palavra parecida mas não ofensiva", () => {
      expect(contemPalavrao("caralho")).toBe(true);
      // "carvalho" não está na lista
      expect(contemPalavrao("carvalho")).toBe(false);
    });
  });
});

// ── validarMensagem (integração) ──────────────────────────────────

describe("validarMensagem", () => {
  test("retorna valida=true para mensagem normal", () => {
    const result = validarMensagem("Olá, podemos agendar para amanhã?");
    expect(result.valida).toBe(true);
    expect(result.erro).toBeUndefined();
  });

  test("retorna erro de telefone", () => {
    const result = validarMensagem("Me liga no 81 99482-2177");
    expect(result.valida).toBe(false);
    expect(result.erro).toContain("contatos telefônicos");
  });

  test("retorna erro de palavrão", () => {
    const result = validarMensagem("você é um otario");
    expect(result.valida).toBe(false);
    expect(result.erro).toContain("conteúdo inadequado");
  });

  test("telefone tem prioridade sobre palavrão (primeira checagem)", () => {
    // Se ambos estiverem presentes, telefone é verificado primeiro
    const result = validarMensagem("caralho 81994822177");
    expect(result.valida).toBe(false);
    expect(result.erro).toContain("contatos telefônicos");
  });

  test("string vazia é válida (sem erro)", () => {
    const result = validarMensagem("");
    expect(result.valida).toBe(true);
  });
});
