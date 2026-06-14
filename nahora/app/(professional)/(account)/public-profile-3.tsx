import React from "react";
import { Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import { Profile3Content } from "@/features/auth/components/Profile3Content";
import { useEditProfileForm } from "@/features/profile/hooks/useEditProfileForm";
import { SuccessPopup } from "@/components/ui/SuccessPopup";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
    Alert.alert("Arquivo muito grande", "Cada foto deve ter no máximo 10MB.");
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
    Alert.alert("Arquivo muito grande", "Cada foto deve ter no máximo 10MB.");
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

export default function PublicProfile3() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const {
    portfolioPhotos,
    addPortfolioPhoto,
    removePortfolioPhoto,
    saveProfile,
  } = useEditProfileForm();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

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

  const handleSubmit = async () => {
      setIsSubmitting(true);
      try {
        await saveProfile();
        setShowSuccess(true);
      } catch {
        Alert.alert("Erro", "Não foi possível salvar as alterações.");
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const handleSuccessDismiss = () => {
      setShowSuccess(false);
      router.replace("/(professional)/(account)");
    };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: "#ffffff" }}
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
          error={null}
          errorStatus={null}
        />
      </ScrollView>
      <SuccessPopup
        visible={showSuccess}
        message="Dados atualizado com sucesso!"
        onDismiss={handleSuccessDismiss}
      />

    </SafeAreaView>
  );
}
