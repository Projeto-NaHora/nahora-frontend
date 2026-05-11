import type { TipoUsuarioApp } from "@/types/enums";
import { useRegisterStore } from "@/store/registerStore";

export function useRegisterRole() {
  const setRole = useRegisterStore((state) => state.setRole);

  const selectRole = (role: TipoUsuarioApp) => {
    setRole(role);
  };

  return { selectRole };
}
