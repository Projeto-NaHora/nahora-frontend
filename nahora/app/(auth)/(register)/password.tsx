import React from "react";
import { useRouter } from "expo-router";

import { PasswordContent } from "../../../features/auth/components/PasswordContent";
import { useRegisterPassword } from "../../../features/auth/hooks/useRegisterPassword";

export default function Screen() {
  const router = useRouter();
  const { form, onSubmit, isSubmitting } = useRegisterPassword({
    onClientSuccess: () => router.replace("/(client)/(home)"),
    onProfessional: () =>
      router.push("/(auth)/(register)/professional/profession"),
    onMissingRole: () => router.replace("/(auth)/(register)/role"),
  });

  return (
    <PasswordContent
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
    />
  );
}
