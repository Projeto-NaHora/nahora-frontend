import React from "react";
import { useRouter } from "expo-router";

import { NameContent } from "../../../features/auth/components/NameContent";
import { useRegisterName } from "../../../features/auth/hooks/useRegisterName";

export default function Screen() {
  const router = useRouter();
  const { form, onSubmit, isSubmitting } = useRegisterName({
    onSuccess: () => router.push("/(auth)/(register)/email"),
  });

  return (
    <NameContent
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
    />
  );
}
