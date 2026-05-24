import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { EditProfilePayload, ProfessionalProfile } from "./types";

export const profileService = {
  // Obter perfil do profissional
  async getProfessionalProfile(): Promise<ProfessionalProfile> {
    const response = await api.get<ProfessionalProfile>(
      ENDPOINTS.PROFESSIONAL_PROFILE,
    );
    return response.data;
  },

  // Atualizar perfil do profissional
  async updateProfessionalProfile(
    payload: EditProfilePayload,
  ): Promise<ProfessionalProfile> {
    const response = await api.put<ProfessionalProfile>(
      ENDPOINTS.PROFESSIONAL_PROFILE,
      payload,
    );
    return response.data;
  },

  // Upload de foto de perfil
  async uploadProfilePhoto(uri: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: "profile-photo.jpg",
    } as any);

    const response = await api.post<{ url: string }>(
      ENDPOINTS.UPLOAD_PROFILE_PHOTO,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};
