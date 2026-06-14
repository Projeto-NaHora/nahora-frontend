// features/settings/hooks/useChangePassword.ts
import { useCallback, useState } from "react";
import { settingsService } from "../service";
import { getApiErrorMessage } from "@/utils/apiError";
import type { ChangePasswordPayload } from "../types";

export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const alterarSenha = useCallback(async (payload: ChangePasswordPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await settingsService.alterarSenha(payload);
      setSuccess(true);
      return null;
    } catch (err) {
      const msg = getApiErrorMessage(err, "Erro ao alterar senha");
      setError(msg);
      return msg;
    } finally {
      setLoading(false);
    }
  }, []);

  return { alterarSenha, loading, error, success, setError, setSuccess };
}
