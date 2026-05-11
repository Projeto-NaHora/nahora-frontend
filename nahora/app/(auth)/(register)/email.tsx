import React from "react";
import { useRouter } from "expo-router";

import { EmailContent } from "../../../features/auth/components/EmailContent";
import { useRegisterEmail } from "../../../features/auth/hooks/useRegisterEmail";

export default function Screen() {
  const router = useRouter();
  const { form, onSubmit, isSubmitting } = useRegisterEmail({
    onSuccess: () => router.push("/(auth)/(register)/password"),
  });

  return (
    <EmailContent
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
    />
  );
}
