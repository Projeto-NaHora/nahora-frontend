import React from "react";
import { useRouter } from "expo-router";

import { ValidationContent } from "@/features/auth/components/ValidationContent";
import { useRegisterStore } from "@/store/registerStore";

export default function Validation() {
  const router = useRouter();
  const profession = useRegisterStore((state) => state.profession);

  const professionLabel = profession
    ? `${profession.label} · Em validação`
    : "Em validação";

  const handleGoToProfile = () => {
    router.push("/(auth)/(register)/professional/profile-1");
  };

  return (
    <ValidationContent
      professionLabel={professionLabel}
      onGoToProfile={handleGoToProfile}
    />
  );
}
