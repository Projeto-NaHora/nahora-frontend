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
      // Spring Boot MethodArgumentNotValidException usa "defaultMessage" em vez de "message"
      if (Array.isArray(data.errors)) {
        for (const err of data.errors) {
          const msg = err.message ?? err.defaultMessage;
          if (err.field && typeof msg === "string") {
            fieldErrors[err.field] = msg;
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

/**
 * Loga todos os detalhes de um erro Axios no console.
 * Útil para depuração, especialmente no React Native com debugging remoto.
 *
 * Exibe:
 * - Método HTTP + URL completa
 * - Payload enviado (request body)
 * - Parâmetros da query string
 * - Headers da requisição
 * - Código de status da resposta
 * - Headers da resposta
 * - Body da resposta
 * - Mensagem de erro do Axios
 * - Código do erro (ECONNABORTED, ERR_NETWORK, etc.)
 */
export function logAxiosError(error: unknown, contextLabel?: string): void {
  if (!axios.isAxiosError(error)) {
    console.warn(
      `[AxiosError${contextLabel ? ` - ${contextLabel}` : ""}] Erro não é um AxiosError:`,
      error,
    );
    return;
  }

  const { config, response, message, code } = error;
  const method = config?.method?.toUpperCase() ?? "?";
  const url = config?.url ?? "?";
  const baseURL = config?.baseURL ?? "";
  const fullUrl = `${baseURL}${url}`;

  const parts: string[] = [];
  parts.push("");
  parts.push("═══════════════════════════════════════════");
  parts.push(
    `  🔴  ${contextLabel ? `${contextLabel} — ` : ""}${method} ${fullUrl}`,
  );
  parts.push("───────────────────────────────────────────");

  // --- Request ---
  parts.push(`  📤 Request`);
  parts.push(`     URL:     ${fullUrl}`);
  parts.push(`     Method:  ${method}`);

  if (config?.params) {
    try {
      parts.push(`     Query:   ${JSON.stringify(config.params)}`);
    } catch {
      parts.push(`     Query:   [unstringifiable]`);
    }
  }

  if (config?.data) {
    try {
      const parsed =
        typeof config.data === "string" ? JSON.parse(config.data) : config.data;
      parts.push(`     Payload: ${JSON.stringify(parsed, null, 2)}`);
    } catch {
      // Se não for JSON (ex.: FormData), exibe como string
      parts.push(`     Payload: ${String(config.data)}`);
    }
  }

  if (config?.headers) {
    const reqHeaders = { ...config.headers };
    // Oculta tokens sensíveis
    if (reqHeaders.Authorization) {
      reqHeaders.Authorization = "Bearer <redacted>";
    }
    try {
      parts.push(`     Headers: ${JSON.stringify(reqHeaders, null, 2)}`);
    } catch {
      parts.push(`     Headers: [unstringifiable]`);
    }
  }

  parts.push("");

  // --- Response ---
  if (response) {
    parts.push(`  📥 Response`);
    parts.push(`     Status:  ${response.status} ${response.statusText}`);

    if (response.headers) {
      try {
        parts.push(
          `     Headers: ${JSON.stringify(response.headers, null, 2)}`,
        );
      } catch {
        parts.push(`     Headers: [unstringifiable]`);
      }
    }

    if (response.data !== undefined) {
      try {
        parts.push(`     Body:    ${JSON.stringify(response.data, null, 2)}`);
      } catch {
        parts.push(`     Body:    [unstringifiable: ${String(response.data)}]`);
      }
    }
  } else {
    parts.push(`  📥 Response: Nenhuma resposta do servidor (erro de rede)`);
  }

  parts.push("");

  // --- Axios metadata ---
  parts.push(`  ℹ️  Axios`);
  parts.push(`     Message: ${message}`);
  if (code) parts.push(`     Code:    ${code}`);
  parts.push("═══════════════════════════════════════════");
  parts.push("");

  console.log(parts.join("\n"));
}
