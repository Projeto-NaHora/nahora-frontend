import useSWRMutation from "swr/mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";

import { useRegisterStore } from "@/store/registerStore";
import { getApiErrorMessage } from "@/utils/apiError";
import { registerPhoneSchema, type RegisterPhoneFormValues } from "../types";
import { unformatPhone } from "@/utils/formatters";
import { authService } from "../service";

type UseRegisterPhoneOptions = {
  onSuccess: () => void;
};

export function useRegisterPhone({ onSuccess }: UseRegisterPhoneOptions) {
  const phone = useRegisterStore((state) => state.phone);
  const setPhone = useRegisterStore((state) => state.setPhone);

  const form = useForm<RegisterPhoneFormValues>({
    resolver: zodResolver(registerPhoneSchema),
    defaultValues: {
      phone,
    },
    mode: "onTouched",
  });

  const { trigger, isMutating } = useSWRMutation(
    "register-phone",
    async (_key: string, { arg }: { arg: string }) =>
      authService.sendOtp({ telefone: arg }),
    {
      onSuccess: () => {
        onSuccess();
      },
      onError: (error) => {
        Alert.alert("Erro", getApiErrorMessage(error));
      },
    },
  );

  const onSubmit = form.handleSubmit((values) => {
    const digits = unformatPhone(values.phone);
    setPhone(digits);
    trigger(digits);
  });

  return {
    form,
    onSubmit,
    isSubmitting: isMutating,
  };
}
