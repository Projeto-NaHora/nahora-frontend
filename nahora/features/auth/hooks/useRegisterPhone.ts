import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRegisterStore } from "@/store/registerStore";
import { parseApiError } from "@/utils/apiError";
import { registerPhoneSchema, type RegisterPhoneFormValues } from "../types";
import { unformatPhone } from "@/utils/formatters";
import { authService } from "../service";

type UseRegisterPhoneOptions = {
  onSuccess: () => void;
};

export function useRegisterPhone({ onSuccess }: UseRegisterPhoneOptions) {
  const phone = useRegisterStore((state) => state.phone);
  const setPhone = useRegisterStore((state) => state.setPhone);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

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
        const parsed = parseApiError(error);
        setErrorMessage(parsed.message);
        setErrorStatus(parsed.statusCode ?? null);
      },
    },
  );

  const onSubmit = form.handleSubmit((values) => {
    setErrorMessage(null);
    setErrorStatus(null);
    const digits = unformatPhone(values.phone);
    setPhone(digits);
    trigger(digits);
  });

  return {
    form,
    onSubmit,
    isSubmitting: isMutating,
    errorMessage,
    errorStatus,
  };
}
