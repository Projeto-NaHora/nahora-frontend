import React from "react";
import { useRouter } from "expo-router";

import { ProfessionContent } from "@/features/auth/components/ProfessionContent";
import { useDefinirCategoria } from "@/features/auth/hooks/useDefinirCategoria";

export default function Profession() {
  const router = useRouter();

  const { selectedProfession, handleSelect, handleContinue, isSubmitting, errorMessage } =
    useDefinirCategoria({
      onSuccess: () => router.push("/(auth)/(register)/professional/docs"),
    });

  return (
    <ProfessionContent
      selected={selectedProfession}
      onSelect={handleSelect}
      onContinue={handleContinue}
      isSubmitting={isSubmitting}
      error={errorMessage}
    />
  );
}
