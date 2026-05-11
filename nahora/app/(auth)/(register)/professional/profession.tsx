import React from "react";
import { useRouter } from "expo-router";

import { ProfessionContent } from "@/features/auth/components/ProfessionContent";
import { useRegisterStore, type ProfessionOption } from "@/store/registerStore";

export default function Profession() {
  const router = useRouter();
  const selectedProfession = useRegisterStore((state) => state.profession);
  const setProfession = useRegisterStore((state) => state.setProfession);

  const handleSelect = (profession: ProfessionOption) => {
    setProfession(profession);
  };

  const handleContinue = () => {
    router.push("/(auth)/(register)/professional/docs");
  };

  return (
    <ProfessionContent
      selected={selectedProfession}
      onSelect={handleSelect}
      onContinue={handleContinue}
    />
  );
}
