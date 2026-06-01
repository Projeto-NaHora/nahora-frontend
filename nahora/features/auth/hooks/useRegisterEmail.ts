import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

import { useRegisterStore } from "@/store/registerStore";
import { parseApiError } from "@/utils/apiError";
import { authService } from "../service";
import { registerEmailSchema, type RegisterEmailFormValues } from "../types";

type UseRegisterEmailOptions = {
  onSuccess: () => void;
};

export function useRegisterEmail({ onSuccess }: UseRegisterEmailOptions) {
  const role = useRegisterStore((state) => state.role);
  const phone = useRegisterStore((state) => state.phone);
  const email = useRegisterStore((state) => state.email);
  const setEmail = useRegisterStore((state) => state.setEmail);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const form = useForm<RegisterEmailFormValues>({
    resolver: zodResolver(registerEmailSchema),
    defaultValues: { email },
    mode: "onTouched",
  });

  const { trigger, isMutating } = useSWRMutation(
    "register-email",
    async (_key: string, { arg }: { arg: string }) =>
      authService.cadastroEmail({ telefone: phone, email: arg }),
    {
      onSuccess: () => onSuccess(),
      onError: (error) => {
        const parsed = parseApiError(error);
        setErrorMessage(parsed.message);
        setErrorStatus(parsed.statusCode ?? null);
      },
    },
  );

  const onSubmit = form.handleSubmit((values) => {
    setEmail(values.email);
    setErrorMessage(null);
    setErrorStatus(null);

    if (role === "PROFISSIONAL") {
      trigger(values.email);
    } else {
      onSuccess();
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting: isMutating,
    errorMessage,
    errorStatus,
  };
}
