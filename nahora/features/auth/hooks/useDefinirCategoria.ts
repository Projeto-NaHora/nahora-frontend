import { useState } from "react";
import { Alert } from "react-native";
import useSWRMutation from "swr/mutation";

import { useRegisterStore, type ProfessionOption } from "@/store/registerStore";
import { parseApiError } from "@/utils/apiError";
import { authService } from "../service";

type UseDefinirCategoriaOptions = {
  onSuccess: () => void;
};

export function useDefinirCategoria({ onSuccess }: UseDefinirCategoriaOptions) {
  const selectedProfession = useRegisterStore((state) => state.profession);
  const setProfession = useRegisterStore((state) => state.setProfession);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const { trigger, isMutating } = useSWRMutation(
    "definir-categoria",
    async (_key: string, { arg }: { arg: string }) =>
      authService.definirCategoria({ categoria: arg }),
    {
      onSuccess: () => onSuccess(),
      onError: (error) => {
        const parsed = parseApiError(error);
        setErrorMessage(parsed.message);
        setErrorStatus(parsed.statusCode ?? null);
      },
    },
  );

  const handleSelect = (profession: ProfessionOption) => {
    setProfession(profession);
  };

  const handleContinue = () => {
    if (!selectedProfession) {
      Alert.alert("Atenção", "Selecione uma profissão para continuar.");
      return;
    }
    setErrorMessage(null);
    setErrorStatus(null);
    trigger(selectedProfession.id);
  };

  return {
    selectedProfession,
    handleSelect,
    handleContinue,
    isSubmitting: isMutating,
    errorMessage,
    errorStatus,
  };
}
