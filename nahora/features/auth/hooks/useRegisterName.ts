import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

import { useRegisterStore } from "@/store/registerStore";
import { parseApiError } from "@/utils/apiError";
import { authService } from "../service";
import { registerNameSchema, type RegisterNameFormValues } from "../types";

type UseRegisterNameOptions = {
  onSuccess: () => void;
};

export function useRegisterName({ onSuccess }: UseRegisterNameOptions) {
  const role = useRegisterStore((state) => state.role);
  const phone = useRegisterStore((state) => state.phone);
  const firstName = useRegisterStore((state) => state.firstName);
  const lastName = useRegisterStore((state) => state.lastName);
  const setName = useRegisterStore((state) => state.setName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const form = useForm<RegisterNameFormValues>({
    resolver: zodResolver(registerNameSchema),
    defaultValues: { firstName, lastName },
    mode: "onTouched",
  });

  const { trigger, isMutating } = useSWRMutation(
    "register-name",
    async (
      _key: string,
      { arg }: { arg: { nome: string; sobrenome: string } },
    ) => authService.cadastroNome({ telefone: phone, ...arg }),
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
    setName(values.firstName, values.lastName);
    setErrorMessage(null);
    setErrorStatus(null);

    if (role === "PROFISSIONAL") {
      trigger({ nome: values.firstName, sobrenome: values.lastName });
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
