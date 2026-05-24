import React from "react";
import { Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import { Profile3Content } from "@/features/auth/components/Profile3Content";
import { useRegisterStore } from "@/store/registerStore";
import { useRegisterProfessional } from "@/features/auth/hooks/useRegisterProfessional";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

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
  return result.assets[0].uri;
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
  return result.assets[0].uri;
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
    useRegisterProfessional({
      onSuccess: () => {
        // Navigate to the professional home after successful registration
        router.replace("/(professional)/(home)");
      },
    });

  const handlePickPhoto = () => {
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
