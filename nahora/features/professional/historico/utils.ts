// features/professional/historico/utils.ts
const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function nomeMes(mes: number): string {
  return MESES[mes - 1] ?? "";
}

export function formatarMoeda(
  valor: number | string | undefined | null,
): string {
  if (valor == null || valor === "") return "R$ 0,00";
  const num = typeof valor === "string" ? Number(valor) : valor;
  if (isNaN(num)) return "R$ 0,00";
  return `R$ ${num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
