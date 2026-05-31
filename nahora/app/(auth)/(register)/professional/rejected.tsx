import React, { useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { useAuthStore } from "@/store/authStore";
import { useRegisterStore } from "@/store/registerStore";

export default function Rejected() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const setRgFrontUri = useRegisterStore((state) => state.setRgFrontUri);
  const setRgBackUri = useRegisterStore((state) => state.setRgBackUri);
  const setSelfieUri = useRegisterStore((state) => state.setSelfieUri);
  const setRgFrontUrl = useRegisterStore((state) => state.setRgFrontUrl);
  const setRgBackUrl = useRegisterStore((state) => state.setRgBackUrl);
  const setSelfieUrl = useRegisterStore((state) => state.setSelfieUrl);

  useEffect(() => {
    const askUser = async () => {
      await new Promise<void>((resolve) => {
        Alert.alert(
          "Documentos rejeitados",
          "Os documentos enviados foram rejeitados. Deseja enviar novos documentos?",
          [
            {
              text: "Não",
              style: "cancel",
              onPress: () => {
                logout();
                resolve();
              },
            },
            {
              text: "Sim",
              onPress: () => {
                // Clear document URIs and URLs so the docs screen starts fresh
                setRgFrontUri(null);
                setRgBackUri(null);
                setSelfieUri(null);
                setRgFrontUrl(null);
                setRgBackUrl(null);
                setSelfieUrl(null);

                router.replace("/(auth)/(register)/professional/docs");
                resolve();
              },
            },
          ],
        );
      });
    };

    askUser();
  }, []);

  // Renders nothing — the Alert is the entire interaction.
  return null;
}
