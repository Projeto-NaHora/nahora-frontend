import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";

import type {
  CompletarPerfilRequest,
  LoginPayload,
  LoginResponse,
  PerfilProfissionalResponse,
  RegisterClientPayload,
  RegisterProfessionalPayload,
  RegisterResponse,
  SendOtpPayload,
  SendOtpResponse,
  UploadDocumentoResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "./types";

export const authService = {
  sendOtp: async (payload: SendOtpPayload): Promise<SendOtpResponse> => {
    const { data } = await api.post<SendOtpResponse>(
      ENDPOINTS.SEND_OTP,
      payload,
    );
    return data;
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const { data } = await api.post<VerifyOtpResponse>(
      ENDPOINTS.VERIFY_OTP,
      payload,
    );
    return data;
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>(ENDPOINTS.LOGIN, payload);
    return data;
  },
  registerClient: async (
    payload: RegisterClientPayload,
  ): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>(
      ENDPOINTS.REGISTER_CLIENTE,
      payload,
    );
    return data;
  },
  uploadDocumento: async (
    fileUri: string,
    tipo: string,
  ): Promise<UploadDocumentoResponse> => {
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      type: "image/jpeg",
      name: `${tipo.toLowerCase()}.jpg`,
    } as any);
    formData.append("tipo", tipo);

    const { data } = await api.post<UploadDocumentoResponse>(
      ENDPOINTS.UPLOAD_DOCUMENTO,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      },
    );
    return data;
  },

  registerProfessional: async (
    payload: RegisterProfessionalPayload,
  ): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>(
      ENDPOINTS.REGISTER_PROFISSIONAL,
      payload,
    );
    return data;
  },

  completarPerfil: async (
    payload: CompletarPerfilRequest,
  ): Promise<PerfilProfissionalResponse> => {
    const { data } = await api.put<PerfilProfissionalResponse>(
      ENDPOINTS.COMPLETAR_PERFIL,
      payload,
    );
    return data;
  },
};
