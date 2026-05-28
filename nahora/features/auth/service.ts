import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";

import type {
  CadastroEmailPayload,
  CadastroNomePayload,
  CadastroSenhaPayload,
  CompletarPerfilRequest,
  DefinirCategoriaPayload,
  EnviarDocumentosPayload,
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
      ENDPOINTS.ENVIAR_OTP,
      payload,
    );
    return data;
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const { data } = await api.post<VerifyOtpResponse>(
      ENDPOINTS.VERIFICAR_OTP,
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

  cadastroEmail: async (payload: CadastroEmailPayload): Promise<void> => {
    await api.post(ENDPOINTS.CADASTRO_EMAIL, payload);
  },

  cadastroNome: async (payload: CadastroNomePayload): Promise<void> => {
    await api.post(ENDPOINTS.CADASTRO_NOME, payload);
  },

  cadastroSenha: async (
    payload: CadastroSenhaPayload,
  ): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>(
      ENDPOINTS.CADASTRO_SENHA,
      payload,
    );
    return data;
  },

  definirCategoria: async (payload: DefinirCategoriaPayload): Promise<void> => {
    await api.post(ENDPOINTS.PROFISSIONAL_CATEGORIA, payload);
  },

  enviarDocumentos: async (payload: EnviarDocumentosPayload): Promise<void> => {
    await api.post(ENDPOINTS.PROFISSIONAL_DOCUMENTOS, payload);
  },
};
