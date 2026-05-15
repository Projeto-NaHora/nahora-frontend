import axios from "axios";

export interface ApiErrorResult {
  message: string;
  fieldErrors: Record<string, string>;
  /** Código HTTP da resposta (ex.: 400, 401, 500). Undefined quando é erro de rede/sem resposta. */
  statusCode?: number;
}

/**
 * Extrai a mensagem geral e erros de campo do retorno do backend.
 *
 * Formatos aceitos:
 * - `{ message: "...", fields: { campo: "erro" } }` — Spring Boot field errors
 * - `{ message: "...", errors: [{ field: "campo", message: "erro" }] }` — lista de erros
 */
export function parseApiError(
  error: unknown,
  fallback = "Algo deu errado",
): ApiErrorResult {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data) {
      const fieldErrors: Record<string, string> = {};

      // Formato 1: { fields: { campo: "mensagem", ... } }
      if (
        data.fields &&
        typeof data.fields === "object" &&
        !Array.isArray(data.fields)
      ) {
        for (const [key, msg] of Object.entries(data.fields)) {
          if (typeof msg === "string") {
            fieldErrors[key] = msg;
          }
        }
      }

      // Formato 2: { errors: [{ field: "campo", message: "mensagem" }, ...] }
      if (Array.isArray(data.errors)) {
        for (const err of data.errors) {
          if (err.field && typeof err.message === "string") {
            fieldErrors[err.field] = err.message;
          }
        }
      }

      return {
        message: data.message ?? fallback,
        fieldErrors,
        statusCode: error.response?.status,
      };
    }

    // Erro de rede (sem resposta do servidor)
    return { message: fallback, fieldErrors: {}, statusCode: undefined };
  }
  return { message: fallback, fieldErrors: {} };
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Algo deu errado",
): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}
