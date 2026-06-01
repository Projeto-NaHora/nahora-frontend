import React, { useCallback } from "react";
import { useRouter } from "expo-router";

import { ValidationContent } from "@/features/auth/components/ValidationContent";
import { useVerificacaoPolling } from "@/features/auth/hooks/useVerificacaoPolling";
import { useRegisterStore } from "@/store/registerStore";
import { useAuthStore } from "@/store/authStore";

export default function Validation() {
  const router = useRouter();
  const profession = useRegisterStore((state) => state.profession);
  const setProfessionalOnboarding = useAuthStore(
    (state) => state.setProfessionalOnboarding,
  );

  const professionLabel = profession
    ? `${profession.label} · Em validação`
    : "Em validação";

  const handleApproval = useCallback(async () => {
    await setProfessionalOnboarding("perfil");
    router.replace("/(onboarding)/profile-1");
  }, [setProfessionalOnboarding, router]);

  useVerificacaoPolling(handleApproval);

  return <ValidationContent professionLabel={professionLabel} />;
}
