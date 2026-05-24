import type { Mensagem } from "@/features/chat/types";

/**
 * Formats a raw digit string into Brazilian phone format (xx) xxxxx-xxxx
 */
export function formatPhone(value: string): string {
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, "");

  // Limita a 11 dígitos (2 DDD + 9 número)
  const trimmed = digits.slice(0, 11);

  if (trimmed.length <= 2) {
    return trimmed.length ? `(${trimmed}` : "";
  }

  if (trimmed.length <= 7) {
    return `(${trimmed.slice(0, 2)}) ${trimmed.slice(2)}`;
  }

  return `(${trimmed.slice(0, 2)}) ${trimmed.slice(2, 7)}-${trimmed.slice(7)}`;
}

/**
 * Removes all non-digit characters from a phone string
 */
export function unformatPhone(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Formats a raw digit string into Brazilian CPF format xxx.xxx.xxx-xx
 */
export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

/**
 * Removes all non-digit characters from a CPF string
 */
export function unformatCpf(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Validates a CPF using the official algorithm (verification digits).
 * Accepts both formatted and raw CPF strings.
 */
/**
 * Returns initials from a name (first + last word initial).
 * Handles single name, undefined, and multiple middle names.
 */
export function getInitials(nome?: string): string {
  if (!nome) return "?";
  const parts = nome.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Formats a raw digit string into Brazilian CEP format 00000-000
 */
export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/**
 * Formats ISO datetime to HH:mm (24h).
 */
export function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Returns "HOJE", "ONTEM", or "DD/MM/YYYY" for a date separator.
 */
export function formatDateSeparator(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24);
  if (diff === 0) return "HOJE";
  if (diff === 1) return "ONTEM";
  return d.toLocaleDateString("pt-BR");
}

/**
 * Groups messages by date, inserting DateSeparatorEntry markers between days.
 */
export function groupMessagesByDate(
  messages: Mensagem[],
): (Mensagem | { __type: "date-separator"; date: string })[] {
  const result: (Mensagem | { __type: "date-separator"; date: string })[] = [];
  let lastDate = "";
  for (const msg of messages) {
    const date = msg.criadoEm.slice(0, 10);
    if (date !== lastDate) {
      result.push({ __type: "date-separator", date: msg.criadoEm });
      lastDate = date;
    }
    result.push(msg);
  }
  return result;
}

export function isValidCpf(value: string): boolean {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 11) return false;

  // Reject if all digits are the same (e.g. 111.111.111-11)
  if (/^(\d)\1{10}$/.test(digits)) return false;

  // Validate first verification digit (10th digit)
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i], 10) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  const firstDigit = remainder === 10 ? 0 : remainder;

  if (firstDigit !== parseInt(digits[9], 10)) return false;

  // Validate second verification digit (11th digit)
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i], 10) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  const secondDigit = remainder === 10 ? 0 : remainder;

  if (secondDigit !== parseInt(digits[10], 10)) return false;

  return true;
}
