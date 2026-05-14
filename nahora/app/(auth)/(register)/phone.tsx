import React from "react";
import { useRouter } from "expo-router";

import { PhoneContent } from "../../../features/auth/components/PhoneContent";
import { useRegisterPhone } from "../../../features/auth/hooks/useRegisterPhone";

export default function Screen() {
  const router = useRouter();
  const { form, onSubmit, isSubmitting } = useRegisterPhone({
    onSuccess: () => router.push("/(auth)/(register)/otp"),
  });

  return (
    <PhoneContent
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
    />
  );
}
