// features/profile/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { PerfilProfissionalDTO, ProfissionalPerfilRequest } from "./types";

const isRemoteUrl = (uri: string) => uri.startsWith("http");

export const profileService = {
  buscarPerfilParaEdicao: async (): Promise<PerfilProfissionalDTO> => {
    const { data } = await api.get<PerfilProfissionalDTO>(
      ENDPOINTS.COMPLETAR_PERFIL,
    );
    return data;
  },

  uploadFoto: async (uri: string, tipo?: string): Promise<string> => {
    const formData = new FormData();
    const fileName = tipo ? `${tipo.toLowerCase()}.jpg` : "foto.jpg";
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: fileName,
    } as any);
    if (tipo) {
      formData.append("tipo", tipo);
    }
    const { data } = await api.post<{ url: string }>(
      ENDPOINTS.UPLOAD_DOCUMENTO,
      formData,
      { headers: { "Content-Type": "multipart/form-data" }, timeout: 60000 },
    );
    return data.url;
  },

  salvarPerfil: async (
    payload: ProfissionalPerfilRequest,
  ): Promise<PerfilProfissionalDTO> => {
    const { data } = await api.put<PerfilProfissionalDTO>(
      ENDPOINTS.COMPLETAR_PERFIL,
      payload,
    );
    return data;
  },
};
