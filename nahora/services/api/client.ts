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

// Tenta refresh silencioso quando recebe 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
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
