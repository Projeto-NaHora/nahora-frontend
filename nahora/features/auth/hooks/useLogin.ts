import useSWRMutation from "swr/mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";

import { useAuthStore } from "@/store/authStore";
import { getApiErrorMessage } from "@/utils/apiError";
import { authService } from "../service";
import type { LoginFormValues, LoginPayload } from "../types";
import { loginSchema } from "../types";

export function useLogin() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identificador: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const setTokens = useAuthStore((state) => state.setTokens);

  const { trigger, isMutating } = useSWRMutation(
    "login",
    async (_key: string, { arg }: { arg: LoginPayload }) => {
      return authService.login(arg);
    },
    {
      onSuccess: async (data) => {
        await setTokens(data.accessToken, data.refreshToken, data.tipoUsuario);
      },
      onError: (error) => {
        Alert.alert("Erro", getApiErrorMessage(error));
      },
    },
  );

  const onSubmit = form.handleSubmit((values) => {
    trigger({
      identificador: values.identificador,
      senha: values.password,
    });
  });

  return {
    form,
    onSubmit,
    isSubmitting: isMutating,
  };
}
