import React from "react";
import { useRouter } from "expo-router";

import { RoleContent } from "../../../features/auth/components/RoleContent";
import { useRegisterRole } from "../../../features/auth/hooks/useRegisterRole";

export default function Screen() {
  const router = useRouter();
  const { selectRole } = useRegisterRole();

  return (
    <RoleContent
      onSelectProfessional={() => {
        selectRole("PROFISSIONAL");
        router.push("/(auth)/(register)/phone");
      }}
      onSelectClient={() => {
        selectRole("CLIENTE");
        router.push("/(auth)/(register)/phone");
      }}
    />
  );
}
