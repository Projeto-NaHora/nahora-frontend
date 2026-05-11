import { Alert } from "react-native";
import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/store/authStore";
import { useRegisterStore } from "@/store/registerStore";
import { getApiErrorMessage } from "@/utils/apiError";
import { authService } from "../service";

type UseRegisterProfessionalOptions = {
  onSuccess: () => void;
};

export function useRegisterProfessional({
  onSuccess,
}: UseRegisterProfessionalOptions) {
  const firstName = useRegisterStore((state) => state.firstName);
  const lastName = useRegisterStore((state) => state.lastName);
  const email = useRegisterStore((state) => state.email);
  const phone = useRegisterStore((state) => state.phone);
  const password = useRegisterStore((state) => state.password);
  const profession = useRegisterStore((state) => state.profession);
  const cpf = useRegisterStore((state) => state.cpf);
  const especialidades = useRegisterStore((state) => state.especialidades);
  const experienceYears = useRegisterStore((state) => state.experienceYears);
  const location = useRegisterStore((state) => state.location);
  const rgFrontUrl = useRegisterStore((state) => state.rgFrontUrl);
  const rgBackUrl = useRegisterStore((state) => state.rgBackUrl);
  const selfieUrl = useRegisterStore((state) => state.selfieUrl);
  const reset = useRegisterStore((state) => state.reset);
  const setTokens = useAuthStore((state) => state.setTokens);

  const mutation = useMutation({
    mutationFn: async () => {
      const anosExperiencia = parseInt(experienceYears, 10) || 0;

      const payload = {
        nome: `${firstName} ${lastName}`.trim(),
        email,
        telefone: phone,
        senha: password,
        categoriaServico: profession?.id ?? "",
        cpf,
        especialidades,
        anosExperiencia,
        areaAtuacao: location ? [location] : [],
        rgFrenteUrl: rgFrontUrl!,
        rgVersoUrl: rgBackUrl!,
        selfieUrl: selfieUrl!,
      };

      // Cadastro profissional (já retorna accessToken, refreshToken e tipoUsuario)
      return authService.registerProfessional(payload);
    },
    onSuccess: async (data) => {
      await setTokens(data.accessToken, data.refreshToken, data.tipoUsuario);
      reset();
      onSuccess();
    },
    onError: (error) => {
      Alert.alert("Erro", getApiErrorMessage(error));
    },
  });

  return {
    submit: mutation.mutate,
    isSubmitting: mutation.isPending,
  };
}
