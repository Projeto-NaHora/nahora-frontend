import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";

import { useRegisterStore } from "@/store/registerStore";
import { getApiErrorMessage } from "@/utils/apiError";
import { formatPhone } from "@/utils/formatters";
import { authService } from "../service";

type UseRegisterOtpOptions = {
  onSuccess: () => void;
};

export function useRegisterOtp({ onSuccess }: UseRegisterOtpOptions) {
  const phone = useRegisterStore((state) => state.phone);
  const [code, setCode] = useState("");

  const mutation = useMutation({
    mutationFn: () => authService.verifyOtp({ telefone: phone, codigo: code }),
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      Alert.alert("Erro", getApiErrorMessage(error));
    },
  });

  const onSubmit = () => {
    if (code.length !== 6) {
      Alert.alert("Código incompleto", "Digite os 6 dígitos do código.");
      return;
    }
    mutation.mutate();
  };

  return {
    phoneLabel: phone ? formatPhone(phone) : undefined,
    code,
    onChangeCode: setCode,
    onSubmit,
    isSubmitting: mutation.isPending,
    error: mutation.error ? getApiErrorMessage(mutation.error) : undefined,
  };
}
