import { useMutation } from "@tanstack/react-query";
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

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async (data) => {
      await setTokens(data.accessToken, data.refreshToken, data.tipoUsuario);
    },
    onError: (error) => {
      Alert.alert("Erro", getApiErrorMessage(error));
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate({
      identificador: values.identificador,
      senha: values.password,
    });
  });

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
  };
}
