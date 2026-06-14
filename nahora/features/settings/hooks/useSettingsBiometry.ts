// features/settings/hooks/useSettingsBiometry.ts
import { useState, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { storage } from "@/utils/storage";

const BIOMETRY_KEY = "biometryEnabled";
const BIOMETRY_LABEL_KEY = "biometryLabel";

export type BiometryType = "face" | "fingerprint" | null;

export function useSettingsBiometry() {
  const [enabled, setEnabled] = useState(false);
  const [biometryType, setBiometryType] = useState<BiometryType>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check biometry availability and load persisted state
  useEffect(() => {
    async function init() {
      try {
        const [storedEnabled] = await Promise.all([
          storage.get(BIOMETRY_KEY),
          storage.get(BIOMETRY_LABEL_KEY),
        ]);

        // We need to dynamically import expo-local-authentication
        // so it works on all platforms
        const {
          hasHardwareAsync,
          isEnrolledAsync,
          supportedAuthenticationTypesAsync,
          AuthenticationType,
        } = await import("expo-local-authentication");

        const [hasHardware, isEnrolled, supportedTypes] = await Promise.all([
          hasHardwareAsync(),
          isEnrolledAsync(),
          supportedAuthenticationTypesAsync(),
        ]);

        const supported = hasHardware && isEnrolled;
        setIsSupported(supported);

        // Determine biometry type
        if (supported) {
          if (supportedTypes.includes(AuthenticationType.FACIAL_RECOGNITION)) {
            setBiometryType("face");
          } else if (supportedTypes.includes(AuthenticationType.FINGERPRINT)) {
            setBiometryType("fingerprint");
          }
        }

        // Restore persisted state
        if (storedEnabled === "true" && supported) {
          setEnabled(true);
        } else {
          setEnabled(false);
        }
      } catch {
        // local-auth not available → disabled
        setIsSupported(false);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const toggleBiometry = useCallback(
    async (newValue: boolean) => {
      if (!isSupported) return;

      if (newValue) {
        // Activating: require biometric prompt
        try {
          const { authenticateAsync } =
            await import("expo-local-authentication");

          const result = await authenticateAsync({
            promptMessage:
              biometryType === "face"
                ? "Confirme sua identidade com Face ID"
                : "Confirme sua identidade",
            fallbackLabel: "Usar senha do dispositivo",
          });

          if (result.success) {
            setEnabled(true);
            await storage.set(BIOMETRY_KEY, "true");
            await storage.set(BIOMETRY_LABEL_KEY, biometryType ?? "");
          }
          // If user cancels, do nothing
        } catch {
          // Auth failed silently
        }
      } else {
        // Deactivating: just persist
        setEnabled(false);
        await storage.set(BIOMETRY_KEY, "false");
      }
    },
    [isSupported, biometryType],
  );

  const subtitle = (() => {
    if (!isSupported) {
      return "Dispositivo sem suporte biométrico";
    }
    if (biometryType === "face") {
      return "Use Face ID para logar";
    }
    if (biometryType === "fingerprint") {
      return "Use impressão digital para logar";
    }
    return Platform.OS === "ios"
      ? "Use Face ID para logar"
      : "Use biometria para logar";
  })();

  return {
    enabled,
    isSupported,
    loading,
    biometryType,
    subtitle,
    toggleBiometry,
  };
}
