// hooks/useBiometria.ts
import { useState, useEffect, useCallback } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const BIOMETRY_KEY = "nahora-biometry-enabled";

export function useBiometria() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [compatible, enrolled] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
        ]);
        setIsAvailable(compatible && enrolled);

        const stored = SecureStore.getItem(BIOMETRY_KEY);
        setIsEnabled(stored === "true");
      } catch {
        // ignore
      }
      setIsChecking(false);
    })();
  }, []);

  const setEnabled = useCallback(async (value: boolean) => {
    try {
      if (value) {
        // Test authentication before enabling
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Autentique-se para ativar",
          fallbackLabel: "Usar senha",
        });
        if (!result.success) return;
      }
      SecureStore.setItem(BIOMETRY_KEY, String(value));
      setIsEnabled(value);
    } catch {
      // ignore
    }
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!isEnabled || !isAvailable) return true; // skip if not enabled
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autentique-se para acessar o app",
        fallbackLabel: "Usar senha",
      });
      return result.success;
    } catch {
      return false;
    }
  }, [isEnabled, isAvailable]);

  return {
    isAvailable,
    isEnabled,
    isChecking,
    setEnabled,
    authenticate,
  };
}
