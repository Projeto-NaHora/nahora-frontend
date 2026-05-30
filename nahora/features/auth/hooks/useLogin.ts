import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAuthStore } from "@/store/authStore";
import { parseApiError } from "@/utils/apiError";
import { authService } from "../service";
import type { LoginFormValues, LoginPayload } from "../types";
import { loginSchema } from "../types";

export function useLogin() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

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

  const { trigger, isMutating } = useSWRMutation(
    "login",
    async (_key: string, { arg }: { arg: LoginPayload }) => {
      return authService.login(arg);
    },
    {
      onSuccess: async (data) => {
        await setProfessionalOnboarding(null);
        await setTokens(data.accessToken, data.refreshToken, data.tipoUsuario);
      },
      onError: (error) => {
        const parsed = parseApiError(error);
        setErrorMessage(parsed.message);
        setErrorStatus(parsed.statusCode ?? null);
      },
    },
  );

  const onSubmit = form.handleSubmit((values) => {
    setErrorMessage(null);
    setErrorStatus(null);
    trigger({
      identificador: values.identificador,
      senha: values.password,
    });
  });

  return {
    form,
    onSubmit,
    isSubmitting: isMutating,
    errorMessage,
    errorStatus,
  };
}
