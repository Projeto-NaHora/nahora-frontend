import axios from "axios";

import { useAuthStore } from "@/store/authStore";
import { storage } from "@/utils/storage";

export const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });

// Injeta o access token em cada requisição
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Trata refresh silencioso quando recebe 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // === CONSOLE LOG DO ERRO ESPECÍFICO ===
    console.error("[AXIOS ERROR HANDLER] Erro capturado:", {
      message: error.message,
      code: error.code,
      isAxiosError: error.isAxiosError,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      request: error.request
        ? {
            method: error.request.method,
            url: error.request.url,
            headers: error.request.headers,
          }
        : null,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });
    // === FIM DO CONSOLE LOG ===

    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await storage.get("refreshToken");
        const { data } = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
          {
            refreshToken,
          },
        );
        useAuthStore
          .getState()
          .setTokens(data.accessToken, data.refreshToken, data.tipoUsuario);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  },
);
