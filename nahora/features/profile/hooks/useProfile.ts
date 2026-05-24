// features/profile/hooks/useProfile.ts
import useSWR from "swr";
import { profileService } from "../service";

export const profileKeys = {
  professionalProfile: "professional-profile",
} as const;

export function useProfessionalProfile() {
  return useSWR(profileKeys.professionalProfile, () =>
    profileService.buscarPerfilProfissional(),
  );
}
