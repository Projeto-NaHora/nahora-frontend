// features/profile/service.ts
import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { PerfilProfissionalDTO, ProfissionalPerfilRequest } from "./types";
import type { ClientePerfilResponse, ClientePerfilRequest } from "./types";
import type { EnderecoResponse, EnderecoRequest } from "./types";
import type {
  PreferenciasNotificacao,
  AtualizarSenhaRequest,
} from "./types";

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

  /** @deprecated Use buscarPerfilParaEdicao */
  buscarPerfilProfissional: async (): Promise<PerfilProfissionalDTO> => {
    const { data } = await api.get<PerfilProfissionalDTO>(
      ENDPOINTS.COMPLETAR_PERFIL,
    );
    return data;
  },

  // ---- Cliente ----
  buscarPerfilCliente: async (): Promise<ClientePerfilResponse> => {
    const { data } = await api.get<ClientePerfilResponse>(
      ENDPOINTS.PERFIL_CLIENTE,
    );
    return data;
  },

  salvarPerfilCliente: async (
    payload: ClientePerfilRequest,
  ): Promise<ClientePerfilResponse> => {
    const { data } = await api.put<ClientePerfilResponse>(
      ENDPOINTS.PERFIL_CLIENTE,
      payload,
    );
    return data;
  },

  // ---- Endereços ----
  listarEnderecos: async (): Promise<EnderecoResponse[]> => {
    const { data } = await api.get<EnderecoResponse[]>(
      ENDPOINTS.CLIENTES_ENDERECOS,
    );
    return data;
  },

  criarEndereco: async (payload: EnderecoRequest): Promise<EnderecoResponse> => {
    const { data } = await api.post<EnderecoResponse>(
      ENDPOINTS.CLIENTES_ENDERECOS,
      payload,
    );
    return data;
  },

  editarEndereco: async (
    id: number,
    payload: EnderecoRequest,
  ): Promise<EnderecoResponse> => {
    const { data } = await api.put<EnderecoResponse>(
      ENDPOINTS.CLIENTE_ENDERECO(id),
      payload,
    );
    return data;
  },

  definirEnderecoPadrao: async (id: number): Promise<EnderecoResponse> => {
    const { data } = await api.patch<EnderecoResponse>(
      ENDPOINTS.CLIENTE_ENDERECO_PADRAO(id),
    );
    return data;
  },

  deletarEndereco: async (id: number): Promise<void> => {
    await api.delete(ENDPOINTS.CLIENTE_ENDERECO(id));
  },

  // ---- Endereços (Profissional) ----

  listarEnderecosProfissional: async (): Promise<EnderecoResponse[]> => {
    const { data } = await api.get<EnderecoResponse[]>(
      ENDPOINTS.PROFISSIONAIS_ENDERECOS,
    );
    return data;
  },

  criarEnderecoProfissional: async (payload: EnderecoRequest): Promise<EnderecoResponse> => {
    const { data } = await api.post<EnderecoResponse>(
      ENDPOINTS.PROFISSIONAIS_ENDERECOS,
      payload,
    );
    return data;
  },

  editarEnderecoProfissional: async (
    id: number,
    payload: EnderecoRequest,
  ): Promise<EnderecoResponse> => {
    const { data } = await api.put<EnderecoResponse>(
      ENDPOINTS.PROFISSIONAL_ENDERECO(id),
      payload,
    );
    return data;
  },

  definirEnderecoPadraoProfissional: async (id: number): Promise<EnderecoResponse> => {
    const { data } = await api.patch<EnderecoResponse>(
      ENDPOINTS.PROFISSIONAL_ENDERECO_PADRAO(id),
    );
    return data;
  },

  deletarEnderecoProfissional: async (id: number): Promise<void> => {
    await api.delete(ENDPOINTS.PROFISSIONAL_ENDERECO(id));
  },

  // ---- Configurações ----
  buscarPreferencias: async (): Promise<PreferenciasNotificacao> => {
    const { data } = await api.get<PreferenciasNotificacao>(
      ENDPOINTS.USUARIOS_PREFERENCIAS,
    );
    return data;
  },

  atualizarPreferencias: async (
    payload: Partial<PreferenciasNotificacao>,
  ): Promise<PreferenciasNotificacao> => {
    const { data } = await api.patch<PreferenciasNotificacao>(
      ENDPOINTS.USUARIOS_PREFERENCIAS,
      payload,
    );
    return data;
  },

  atualizarSenha: async (payload: AtualizarSenhaRequest): Promise<void> => {
    await api.put(ENDPOINTS.USUARIOS_SENHA, payload);
  },

  excluirConta: async (senha: string): Promise<void> => {
    await api.delete(ENDPOINTS.USUARIOS_CONTA, {
      data: { senha },
    });
  },

};
