import React from "react";
import { Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import { Profile3Content } from "@/features/auth/components/Profile3Content";
import { useRegisterStore } from "@/store/registerStore";
import { useCompleteProfessionalRegistration } from "@/features/auth/hooks/useCompleteProfessionalRegistration";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function pickFromGallery(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permissão necessária",
      "Precisamos acessar sua galeria para selecionar as fotos.",
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.8,
    allowsEditing: false,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
    Alert.alert(
      "Arquivo muito grande",
      "Cada foto deve ter no máximo 10MB.",
    );
    return null;
  }

  return asset.uri;
}

async function takeFromCamera(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permissão necessária",
      "Precisamos acessar sua câmera para tirar a foto.",
    );
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.8,
    allowsEditing: false,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
    Alert.alert(
      "Arquivo muito grande",
      "Cada foto deve ter no máximo 10MB.",
    );
    return null;
  }

  return asset.uri;
}

function showPickOptions(onSelect: (uri: string) => void) {
  Alert.alert("Adicionar Foto", "Escolha a origem da foto:", [
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

export default function Profile3() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const portfolioPhotos = useRegisterStore((state) => state.portfolioPhotos);
  const addPortfolioPhoto = useRegisterStore(
    (state) => state.addPortfolioPhoto,
  );
  const removePortfolioPhoto = useRegisterStore(
    (state) => state.removePortfolioPhoto,
  );

  const { submit, isSubmitting, errorMessage, errorStatus } =
    useCompleteProfessionalRegistration({
      onSuccess: () => {
        router.replace("/(professional)/(home)");
      },
    });

  const handlePickPhoto = () => {
    if (portfolioPhotos.length >= MAX_PHOTOS) {
      Alert.alert(
        "Limite atingido",
        `Você pode enviar no máximo ${MAX_PHOTOS} fotos.`,
      );
      return;
    }
    showPickOptions((uri) => {
      addPortfolioPhoto(uri);
    });
  };

  const handleRemovePhoto = (index: number) => {
    removePortfolioPhoto(index);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    submit();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Profile3Content
          portfolioPhotos={portfolioPhotos}
          onPickPhoto={handlePickPhoto}
          onRemovePhoto={handleRemovePhoto}
          onBack={handleBack}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={errorMessage}
          errorStatus={errorStatus}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
