import { Alert } from "react-native";
import useSWRMutation from "swr/mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAuthStore } from "@/store/authStore";
import { useRegisterStore } from "@/store/registerStore";
import { getApiErrorMessage } from "@/utils/apiError";
import { authService } from "../service";
import {
  registerPasswordSchema,
  type RegisterPasswordFormValues,
} from "../types";

type UseRegisterPasswordOptions = {
  onClientSuccess: () => void;
  onProfessional: () => void;
  onMissingRole?: () => void;
};

export function useRegisterPassword({
  onClientSuccess,
  onProfessional,
  onMissingRole,
}: UseRegisterPasswordOptions) {
  const role = useRegisterStore((state) => state.role);
  const phone = useRegisterStore((state) => state.phone);
  const firstName = useRegisterStore((state) => state.firstName);
  const lastName = useRegisterStore((state) => state.lastName);
  const email = useRegisterStore((state) => state.email);
  const setPassword = useRegisterStore((state) => state.setPassword);
  const resetRegister = useRegisterStore((state) => state.reset);

  const setTokens = useAuthStore((state) => state.setTokens);

  const form = useForm<RegisterPasswordFormValues>({
    resolver: zodResolver(registerPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const { trigger, isMutating } = useSWRMutation(
    "register-password",
    async (_key: string, { arg }: { arg: RegisterPasswordFormValues }) => {
      const nomeCompleto = `${firstName} ${lastName}`.trim();

      return authService.registerClient({
        telefone: phone,
        nome: nomeCompleto,
        email,
        senha: arg.password,
      });
    },
    {
      onSuccess: async (data) => {
        await setTokens(data.accessToken, data.refreshToken, data.tipoUsuario);
        onClientSuccess();
        resetRegister();
      },
      onError: (error) => {
        Alert.alert("Erro", getApiErrorMessage(error));
      },
    },
  );

  const onSubmit = form.handleSubmit((values) => {
    setPassword(values.password);

    if (!role) {
      Alert.alert("Erro", "Selecione seu perfil para continuar.");
      onMissingRole?.();
      return;
    }

    if (role === "PROFISSIONAL") {
      onProfessional();
      return;
    }

    if (!phone || !firstName || !lastName || !email) {
      Alert.alert(
        "Erro",
        "Complete as etapas anteriores antes de finalizar o cadastro.",
      );
      return;
    }

    trigger(values);
  });

  return {
    form,
    onSubmit,
    isSubmitting: isMutating,
  };
}
