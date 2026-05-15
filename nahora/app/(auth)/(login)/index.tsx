import React from "react";
import { useRouter } from "expo-router";

import { LoginContent } from "../../../features/auth/components/LoginContent";
import { useLogin } from "../../../features/auth/hooks/useLogin";

export default function Screen() {
  const router = useRouter();
  const { form, onSubmit, isSubmitting, errorMessage, errorStatus } =
    useLogin();

  return (
    <LoginContent
      control={form.control}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      error={errorMessage}
      errorStatus={errorStatus}
      onForgotPassword={() => router.push("/(auth)/(forgotpassword)/email")}
      onRegister={() => router.push("/(auth)/(register)/role")}
    />
  );
}
