// features/chat/validation.ts
// Validação pré-envio de mensagens: bloqueio de telefone e palavras de baixo calão.

/**
 * Remove espaços, parênteses, hífens, pontos e sinal de "+" para
 * facilitar a detecção de padrões numéricos independentes de formatação.
 */
function normalizarParaDigitos(texto: string): string {
  return texto.replace(/[\s()\-\.\+]/g, "");
}

/**
 * Normaliza removendo acentos (diacríticos Unicode) e converte para
 * caixa baixa — usado na comparação de palavrões.
 */
function normalizarSemAcento(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// ── Telefone ────────────────────────────────────────────────────────

/**
 * Verifica se o texto contém um número de telefone brasileiro.
 *
 * Estratégia em duas camadas:
 * 1. Detecta formatos comuns com separadores visuais (parênteses, hífen, espaços)
 * 2. Após remover toda a formatação, busca sequências de 8–13 dígitos consecutivos
 *    (intervalo que cobre desde celular sem DDD até fixo com DDI +55 + DDD).
 */
function contemTelefone(texto: string): boolean {
  // Camada 1 — formatos comuns com separadores
  const formatado = [
    // (XX) X XXXX-XXXX  ou  (XX) XXXXX-XXXX
    /\(\d{2,3}\)\s*\d[\d\s]{3,}[\s-]?\d{4}/,
    // +55 (XX) 9XXXX-XXXX  /  +55 XX X XXXX-XXXX
    /\+\d{1,3}\s*\(?\d{2,3}\)?\s*\d[\d\s]{3,}[\s-]?\d{4}/,
    // XXXX-XXXX  (mínimo 8 dígitos com hífen)
    /\d{4,5}[\s-]\d{4}/,
  ];

  if (formatado.some((re) => re.test(texto))) {
    return true;
  }

  // Camada 2 — sequência nua de dígitos (8 a 13 consecutivos)
  const digitos = normalizarParaDigitos(texto);
  const match = digitos.match(/\d{8,13}/);
  if (!match) return false;

  // Falso-positivo: se forem exatamente 8 dígitos começando com "0",
  // provavelmente é CEP (ex.: 01310100) e não telefone.
  const seq = match[0];
  if (seq.length === 8 && seq.startsWith("0")) return false;

  return true;
}

// ── Palavrões ────────────────────────────────────────────────────────

/**
 * Lista de palavras de baixo calão bloqueadas (em caixa baixa e sem acentos).
 * A comparação é feita após normalização NFD do texto da mensagem.
 */
const PALAVROES_BLOQUEADOS: string[] = [
  // Termos ofensivos comuns em português brasileiro
  "caralho",
  "caralh*",
  "porra",
  "pqp",
  "puta que pariu",
  "puta que o pariu",
  "puta q pariu",
  "puta merda",
  "filho da puta",
  "filha da puta",
  "filho duma puta",
  "filha duma puta",
  "fdp",
  "vsf",
  "vai se foder",
  "vai se fuder",
  "vai tomar no cu",
  "vai tomar no c*",
  "vtmnc",
  "vtmc",
  "tnc",
  "tomar no cu",
  "cuzão",
  "cuzao",
  "cuzona",
  "arrombado",
  "arrombada",
  "buceta",
  "bucetao",
  "bucetão",
  "xota",
  "xoxota",
  "pinto",
  "pau no cu",
  "bosta",
  "merda",
  "desgraça",
  "desgraca",
  "desgraçado",
  "desgracado",
  "otário",
  "otario",
  "otária",
  "otaria",
  "babaca",
  "idiota",
  "imbecil",
  "retardado",
  "retardada",
  "escroto",
  "escrota",
  "corno",
  "corna",
  "chifrudo",
  "chifruda",
];

/**
 * Verifica se o texto contém alguma palavra da blacklist.
 * A comparação é feita com ambas as strings normalizadas (sem acento, lowercase)
 * para capturar variações como "palavrão" / "palavrao".
 */
function contemPalavrao(texto: string): boolean {
  const normalizado = normalizarSemAcento(texto);

  return PALAVROES_BLOQUEADOS.some((palavra) => {
    // Palavras com * são tratadas como curinga (ex.: "caralh*" casa "caralho", "caralhos")
    if (palavra.includes("*")) {
      const palavraNormalizada = normalizarSemAcento(palavra);
      const regex = new RegExp(
        palavraNormalizada.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, "\\S*"),
        "i",
      );
      return regex.test(normalizado);
    }
    const palavraNormalizada = normalizarSemAcento(palavra);
    return normalizado.includes(palavraNormalizada);
  });
}

// ── Ponto de entrada ─────────────────────────────────────────────────

export interface ValidacaoResultado {
  valida: boolean;
  erro?: string;
}

/**
 * Valida uma mensagem antes do envio.
 * Retorna `{ valida: false, erro: "..." }` se bloqueada por telefone ou palavrão.
 */
export function validarMensagem(texto: string): ValidacaoResultado {
  if (contemTelefone(texto)) {
    return {
      valida: false,
      erro: "Não é permitido compartilhar contatos telefônicos.",
    };
  }

  if (contemPalavrao(texto)) {
    return {
      valida: false,
      erro: "Mensagem contém conteúdo inadequado.",
    };
  }

  return { valida: true };
}

// Exportações para teste
export const __test = {
  normalizarParaDigitos,
  normalizarSemAcento,
  contemTelefone,
  contemPalavrao,
  PALAVROES_BLOQUEADOS,
};
