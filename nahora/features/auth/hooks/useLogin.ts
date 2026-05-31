import { useCallback, useRef, useState } from "react";
import useSWRMutation from "swr/mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAuthStore } from "@/store/authStore";
import { parseApiError } from "@/utils/apiError";
import type { StatusVerificacao } from "@/types/enums";
import type { ProfessionalOnboarding } from "@/store/authStore";
import { authService } from "../service";
import type { LoginFormValues, LoginPayload } from "../types";
import { loginSchema } from "../types";

// ── Status → onboarding phase mapping ────────────────────────────

function mapStatusToOnboarding(status: StatusVerificacao): ProfessionalOnboarding {
  switch (status) {
    case "CADASTRO_INCOMPLETO":
      return "cadastro_incompleto";
    case "AGUARDANDO_VERIFICACAO":
      return "aguardando";
    case "VERIFICADO":
      return "perfil";
    case "REJEITADO":
      return "rejeitado";
  }
}

// ── Retry helper (exponential backoff, network/5xx only) ─────────

async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      if (attempt >= maxAttempts) throw err;

      // Only retry on network errors (no response) or server errors (5xx).
      const status =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { status: number } }).response?.status
          : null;

      if (status !== null && status < 500) throw err;

      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 4000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// ── Hook ─────────────────────────────────────────────────────────

export function useLogin() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identificador: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const setTokens = useAuthStore((state) => state.setTokens);
  const setProfessionalOnboarding = useAuthStore(
    (state) => state.setProfessionalOnboarding,
  );

  // SWR mutation for the login POST only.
  const { trigger } = useSWRMutation(
    "login",
    async (_key: string, { arg }: { arg: LoginPayload }) => {
      return authService.login(arg);
    },
    // no onSuccess/onError — we handle the chain manually
  );

  const onSubmit = useCallback(
    form.handleSubmit(async (values) => {
      setErrorMessage(null);
      setErrorStatus(null);
      setIsLoading(true);

      try {
        // Phase 1 — Login
        const data = await trigger({
          identificador: values.identificador,
          senha: values.password,
        });

        // Phase 2 — Set tokens so the profile API call has auth
        await setTokens(data.accessToken, data.refreshToken, data.tipoUsuario);

        // Phase 3 — Fetch status (with retry on network/5xx)
        const status = await withRetry(
          () => authService.buscarStatusVerificacao(),
          2,
        );

        // Phase 4 — Redirect to correct onboarding phase
        const phase = mapStatusToOnboarding(status);
        await setProfessionalOnboarding(phase);
      } catch (error) {
        const parsed = parseApiError(error);
        setErrorMessage(parsed.message);
        setErrorStatus(parsed.statusCode ?? null);
      } finally {
        setIsLoading(false);
      }
    }),
    [trigger, setTokens, setProfessionalOnboarding],
  );

  return {
    form,
    onSubmit,
    isSubmitting: isLoading,
    errorMessage,
    errorStatus,
  };
}
