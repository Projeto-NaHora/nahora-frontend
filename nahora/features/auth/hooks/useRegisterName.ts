import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRegisterStore } from "@/store/registerStore";
import { registerNameSchema, type RegisterNameFormValues } from "../types";

type UseRegisterNameOptions = {
  onSuccess: () => void;
};

export function useRegisterName({ onSuccess }: UseRegisterNameOptions) {
  const firstName = useRegisterStore((state) => state.firstName);
  const lastName = useRegisterStore((state) => state.lastName);
  const setName = useRegisterStore((state) => state.setName);

  const form = useForm<RegisterNameFormValues>({
    resolver: zodResolver(registerNameSchema),
    defaultValues: {
      firstName,
      lastName,
    },
    mode: "onTouched",
  });

  const onSubmit = form.handleSubmit((values) => {
    setName(values.firstName, values.lastName);
    onSuccess();
  });

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
}
