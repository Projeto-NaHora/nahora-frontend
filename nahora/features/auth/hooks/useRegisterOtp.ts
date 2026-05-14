import { useState } from "react";
import useSWRMutation from "swr/mutation";
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

  const { trigger, isMutating, error } = useSWRMutation(
    "register-otp",
    async () => authService.verifyOtp({ telefone: phone, codigo: code }),
    {
      onSuccess: () => {
        onSuccess();
      },
      onError: (error) => {
        Alert.alert("Erro", getApiErrorMessage(error));
      },
    },
  );

  const onSubmit = () => {
    if (code.length !== 6) {
      Alert.alert("Código incompleto", "Digite os 6 dígitos do código.");
      return;
    }
    trigger();
  };

  return {
    phoneLabel: phone ? formatPhone(phone) : undefined,
    code,
    onChangeCode: setCode,
    onSubmit,
    isSubmitting: isMutating,
    error: error ? getApiErrorMessage(error) : undefined,
  };
}
