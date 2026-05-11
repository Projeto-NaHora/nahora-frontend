import React from "react";
import { useRouter } from "expo-router";

import { OtpContent } from "../../../features/auth/components/OtpContent";
import { useRegisterOtp } from "../../../features/auth/hooks/useRegisterOtp";

export default function Screen() {
  const router = useRouter();
  const { phoneLabel, code, onChangeCode, onSubmit, isSubmitting, error } =
    useRegisterOtp({
      onSuccess: () => router.push("/(auth)/(register)/name"),
    });

  return (
    <OtpContent
      phoneLabel={phoneLabel}
      code={code}
      onChangeCode={onChangeCode}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={error}
    />
  );
}
