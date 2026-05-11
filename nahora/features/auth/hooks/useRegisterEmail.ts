import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRegisterStore } from "@/store/registerStore";
import { registerEmailSchema, type RegisterEmailFormValues } from "../types";

type UseRegisterEmailOptions = {
  onSuccess: () => void;
};

export function useRegisterEmail({ onSuccess }: UseRegisterEmailOptions) {
  const email = useRegisterStore((state) => state.email);
  const setEmail = useRegisterStore((state) => state.setEmail);

  const form = useForm<RegisterEmailFormValues>({
    resolver: zodResolver(registerEmailSchema),
    defaultValues: {
      email,
    },
    mode: "onTouched",
  });

  const onSubmit = form.handleSubmit((values) => {
    setEmail(values.email);
    onSuccess();
  });

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
}
