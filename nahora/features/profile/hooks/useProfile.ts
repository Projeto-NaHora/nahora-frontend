import useSWR from "swr";
import { profileService } from "../service";
import type { EditProfilePayload } from "../types";

const PROFILE_QUERY_KEY = "profile/professional";

export function useProfileQuery() {
  const { data, error, isLoading, mutate } = useSWR(PROFILE_QUERY_KEY, () =>
    profileService.getProfessionalProfile(),
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export function useUpdateProfile() {
  const { mutate: mutateProfil } = useSWR(PROFILE_QUERY_KEY, () =>
    profileService.getProfessionalProfile(),
  );

  const updateProfile = async (payload: EditProfilePayload) => {
    const result = await profileService.updateProfessionalProfile(payload);
    mutateProfil(result, false);
    return result;
  };

  return {
    mutate: updateProfile,
    isPending: false,
  };
}

export function useUploadProfilePhoto() {
  const { mutate: mutateProfil } = useSWR(PROFILE_QUERY_KEY, () =>
    profileService.getProfessionalProfile(),
  );

  const uploadPhoto = async (uri: string) => {
    const result = await profileService.uploadProfilePhoto(uri);
    mutateProfil();
    return result;
  };

  return {
    mutate: uploadPhoto,
    isPending: false,
  };
}
