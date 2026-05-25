import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { storage } from "@/utils/storage";
import { isTokenExpired } from "@/utils/jwt";
import { logAxiosError } from "@/utils/apiError";

export const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });

let refreshing: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  try {
    const refreshToken = await storage.get("refreshToken");
    if (!refreshToken) return false;
    const { data } = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
      { refreshToken },
    );
    await useAuthStore
      .getState()
      .setTokens(data.accessToken, data.refreshToken, data.tipoUsuario);
    return true;
  } catch (error) {
    logAxiosError(error, "doRefresh");
    useAuthStore.getState().logout();
    return false;
  }
}

// Injeta o access token em cada requisição e renova proativamente se expirado
api.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().accessToken;

  if (token && isTokenExpired(token)) {
    if (!refreshing) {
      refreshing = doRefresh();
    }
    const ok = await refreshing;
    refreshing = null;

    if (ok) {
      const newToken = useAuthStore.getState().accessToken;
      if (newToken) config.headers.Authorization = `Bearer ${newToken}`;
    }
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.url?.includes("disponiveis")) {
    console.log("[DEBUG-d4f2] REQ →", config.method?.toUpperCase(), config.baseURL + config.url, "params:", JSON.stringify(config.params));
  }

  return config;
});

// Tenta refresh silencioso quando recebe 401 ou 403
api.interceptors.response.use(
  (res) => {
    if (res.config.url?.includes("disponiveis")) {
      console.log(
        "[DEBUG-d4f2] RES ← status:", res.status,
        "totalElements:", res.data?.totalElements,
        "contentLength:", res.data?.content?.length,
        "empty:", res.data?.empty,
      );
    }
    return res;
  },
  async (error) => {
    // Loga TODOS os detalhes do erro antes de qualquer tratamento
    logAxiosError(error);

    const original = error.config;
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !original._retry
    ) {
      original._retry = true;

      if (!refreshing) {
        refreshing = doRefresh();
      }
      const ok = await refreshing;
      refreshing = null;

      if (ok) {
        const newToken = useAuthStore.getState().accessToken;
        if (newToken) original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);
