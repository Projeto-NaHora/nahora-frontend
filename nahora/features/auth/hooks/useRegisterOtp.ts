import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { Alert } from "react-native";

import { useRegisterStore } from "@/store/registerStore";
import { parseApiError } from "@/utils/apiError";
import { formatPhone } from "@/utils/formatters";
import { authService } from "../service";

type UseRegisterOtpOptions = {
  onSuccess: () => void;
};

export function useRegisterOtp({ onSuccess }: UseRegisterOtpOptions) {
  const phone = useRegisterStore((state) => state.phone);
  const [code, setCode] = useState("");
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "register-otp",
    async () => authService.verifyOtp({ telefone: phone, codigo: code }),
    {
      onSuccess: () => {
        onSuccess();
      },
      onError: (error) => {
        const parsed = parseApiError(error);
        setErrorStatus(parsed.statusCode ?? null);
        Alert.alert("Erro", parsed.message);
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
    error: error ? parseApiError(error).message : undefined,
    errorStatus: error ? (parseApiError(error).statusCode ?? null) : null,
  };
}
