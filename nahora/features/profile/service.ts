// features/profile/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type {
  PerfilProfissionalDTO,
  ProfissionalPerfilRequest,
} from "./types";

const isRemoteUrl = (uri: string) => uri.startsWith("http");

export const profileService = {
  buscarPerfilParaEdicao: async (): Promise<PerfilProfissionalDTO> => {
    const { data } = await api.get<PerfilProfissionalDTO>(
      ENDPOINTS.COMPLETAR_PERFIL,
    );
    return data;
  },

  uploadFoto: async (uri: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: "foto.jpg",
    } as any);
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

  /** @deprecated Use buscarPerfilParaEdicao */
  buscarPerfilProfissional: async (): Promise<PerfilProfissionalDTO> => {
    const { data } = await api.get<PerfilProfissionalDTO>(
      ENDPOINTS.COMPLETAR_PERFIL,
    );
    return data;
  },
};
