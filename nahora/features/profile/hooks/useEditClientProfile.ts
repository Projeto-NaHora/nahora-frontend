import { useCallback } from "react";
import useSWR from "swr";

import { profileService } from "../service";
import type { ClientePerfilResponse, ClientePerfilRequest } from "../types";

const clientProfileKeys = {
  clientProfile: "client-profile",
} as const;

export function useEditClientProfile() {
  const {
    data: profile,
    isLoading,
    error,
    mutate,
  } = useSWR<ClientePerfilResponse>(
    clientProfileKeys.clientProfile,
    () => profileService.buscarPerfilCliente(),
  );

  const salvar = async (payload: ClientePerfilRequest): Promise<ClientePerfilResponse> => {
    const updated = await profileService.salvarPerfilCliente(payload);
    await mutate(updated, false);
    return updated;
  };

  return {
    profile,
    isLoading,
    error,
    salvar,
    retry: () => mutate(),
  };
}
