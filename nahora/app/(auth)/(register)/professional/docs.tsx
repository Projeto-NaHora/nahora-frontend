import React from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { DocsContent } from "@/features/auth/components/DocsContent";
import { useUploadDocuments } from "@/features/auth/hooks/useUploadDocuments";
import { useRegisterStore } from "@/store/registerStore";
import { useAuthStore } from "@/store/authStore";

type DocType = "rgFront" | "rgBack" | "selfie";

async function requestPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permissão necessária",
      "Precisamos acessar sua galeria para selecionar as fotos dos documentos.",
    );
    return false;
  }
  return true;
}

async function pickFromGallery(): Promise<string | null> {
  const hasPermission = await requestPermission();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.8,
    allowsEditing: false,
  });

  if (result.canceled || !result.assets?.length) return null;
  return result.assets[0].uri;
}

async function takeFromCamera(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permissão necessária",
      "Precisamos acessar sua câmera para tirar a foto dos documentos.",
    );
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.8,
    allowsEditing: false,
  });

  if (result.canceled || !result.assets?.length) return null;
  return result.assets[0].uri;
}

function showPickOptions(onSelect: (uri: string) => void) {
  Alert.alert("Selecionar foto", "Escolha a origem da foto:", [
    {
      text: "Câmera",
      onPress: async () => {
        const uri = await takeFromCamera();
        if (uri) onSelect(uri);
      },
    },
    {
      text: "Galeria",
      onPress: async () => {
        const uri = await pickFromGallery();
        if (uri) onSelect(uri);
      },
    },
    { text: "Cancelar", style: "cancel" },
  ]);
}

export default function Docs() {
  const router = useRouter();
  const setProfessionalOnboarding = useAuthStore(
    (state) => state.setProfessionalOnboarding,
  );
  const rgFrontUri = useRegisterStore((state) => state.rgFrontUri);
  const rgBackUri = useRegisterStore((state) => state.rgBackUri);
  const selfieUri = useRegisterStore((state) => state.selfieUri);
  const setRgFrontUri = useRegisterStore((state) => state.setRgFrontUri);
  const setRgBackUri = useRegisterStore((state) => state.setRgBackUri);
  const setSelfieUri = useRegisterStore((state) => state.setSelfieUri);
  const setRgFrontUrl = useRegisterStore((state) => state.setRgFrontUrl);
  const setRgBackUrl = useRegisterStore((state) => state.setRgBackUrl);
  const setSelfieUrl = useRegisterStore((state) => state.setSelfieUrl);

  const { upload, isUploading, errorMessage, errorStatus } =
    useUploadDocuments();

  const handlePick = (docType: DocType) => {
    const uriSetters: Record<DocType, (uri: string | null) => void> = {
      rgFront: setRgFrontUri,
      rgBack: setRgBackUri,
      selfie: setSelfieUri,
    };
    const urlSetters: Record<DocType, (url: string | null) => void> = {
      rgFront: setRgFrontUrl,
      rgBack: setRgBackUrl,
      selfie: setSelfieUrl,
    };

    showPickOptions((uri) => {
      uriSetters[docType](uri);
      // Clear previously stored URL to force re-upload on Continue
      urlSetters[docType](null);
    });
  };

  const handleContinue = async () => {
    const success = await upload();
    if (success) {
      await setProfessionalOnboarding("aguardando");
      router.push("/(auth)/(register)/professional/validation");
    }
  };

  return (
    <DocsContent
      rgFrontUri={rgFrontUri}
      rgBackUri={rgBackUri}
      selfieUri={selfieUri}
      onPickRgFront={() => handlePick("rgFront")}
      onPickRgBack={() => handlePick("rgBack")}
      onPickSelfie={() => handlePick("selfie")}
      onContinue={handleContinue}
      isUploading={isUploading}
      error={errorMessage}
      errorStatus={errorStatus}
    />
  );
}
