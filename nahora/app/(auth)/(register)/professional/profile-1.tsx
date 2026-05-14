import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import { Profile1Content } from "@/features/auth/components/Profile1Content";
import { useRegisterStore } from "@/store/registerStore";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

async function pickPhoto(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permissão necessária",
      "Precisamos acessar sua galeria para selecionar a foto.",
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.8,
    allowsEditing: true,
    aspect: [1, 1],
  });

  if (result.canceled || !result.assets?.length) return null;
  return result.assets[0].uri;
}

async function takePhoto(): Promise<string | null> {
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
    allowsEditing: true,
    aspect: [1, 1],
  });

  if (result.canceled || !result.assets?.length) return null;
  return result.assets[0].uri;
}

function showPickOptions(onSelect: (uri: string) => void) {
  Alert.alert("Adicionar Foto", "Escolha a origem da foto:", [
    {
      text: "Câmera",
      onPress: async () => {
        const uri = await takePhoto();
        if (uri) onSelect(uri);
      },
    },
    {
      text: "Galeria",
      onPress: async () => {
        const uri = await pickPhoto();
        if (uri) onSelect(uri);
      },
    },
    { text: "Cancelar", style: "cancel" },
  ]);
}

export default function Profile1() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const cpf = useRegisterStore((state) => state.cpf);
  const cargo = useRegisterStore((state) => state.cargo);
  const location = useRegisterStore((state) => state.location);
  const experienceYears = useRegisterStore((state) => state.experienceYears);
  const profilePhotoUri = useRegisterStore((state) => state.profilePhotoUri);
  const setCpf = useRegisterStore((state) => state.setCpf);
  const setCargo = useRegisterStore((state) => state.setCargo);
  const setLocation = useRegisterStore((state) => state.setLocation);
  const setExperienceYears = useRegisterStore(
    (state) => state.setExperienceYears,
  );
  const setProfilePhotoUri = useRegisterStore(
    (state) => state.setProfilePhotoUri,
  );

  const handlePickPhoto = () => {
    showPickOptions((uri) => {
      setProfilePhotoUri(uri);
    });
  };

  const handleContinue = () => {
    router.push("/(auth)/(register)/professional/profile-2");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Profile1Content
            cpf={cpf}
            cargo={cargo}
            location={location}
            experienceYears={experienceYears}
            profilePhotoUri={profilePhotoUri}
            onChangeCpf={setCpf}
            onChangeCargo={setCargo}
            onChangeLocation={setLocation}
            onChangeExperienceYears={setExperienceYears}
            onPickPhoto={handlePickPhoto}
            onContinue={handleContinue}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
