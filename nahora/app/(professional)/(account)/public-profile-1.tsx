import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import { Profile1Content } from "@/features/auth/components/Profile1Content";
import { useEditProfileForm } from "@/features/profile/hooks/useEditProfileForm";
import { Colors } from "@/constants/theme";
import { buscarCep } from "@/services/cep";
import { geocodeAddress } from "@/services/geocode";

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

async function geocodeFromAddress(params: {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}): Promise<{ lat: number; lng: number } | null> {
  const address = `${params.logradouro}, ${params.numero}, ${params.bairro}, ${params.cidade}, ${params.estado}`;
  return geocodeAddress(address);
}

export default function PublicProfile1() {
  const router = useRouter();
  const theme = "light";
  const colors = Colors[theme];
  const [cepLoading, setCepLoading] = useState(false);

  const {
    nome,
    cargo,
    experienceYears,
    profilePhotoUri,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    raioAtuacaoKm,
    latitude,
    longitude,
    setNome,
    setCargo,
    setExperienceYears,
    setProfilePhotoUri,
    setCep,
    setLogradouro,
    setNumero,
    setComplemento,
    setBairro,
    setCidade,
    setEstado,
    setLatitude,
    setLongitude,
    setRaioAtuacaoKm,
  } = useEditProfileForm({ initialize: true });

  const handleBack = () => {
    router.back();
  };

  const handlePickPhoto = () => {
    showPickOptions((uri) => {
      setProfilePhotoUri(uri);
    });
  };

  const handleCepBlur = async () => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const endereco = await buscarCep(digits);
      if (endereco) {
        setLogradouro(endereco.logradouro);
        setBairro(endereco.bairro);
        setCidade(endereco.cidade);
        setEstado(endereco.estado);
      }
    } catch {
      // silently ignore
    } finally {
      setCepLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!cepLoading) {
      try {
        const coords = await geocodeFromAddress({
          logradouro,
          numero,
          bairro,
          cidade,
          estado,
        });
        if (coords && coords.lat !== 0 && coords.lng !== 0) {
          setLatitude(coords.lat);
          setLongitude(coords.lng);
        }
      } catch {
        // proceed even if geocoding fails
      }
    }
    router.push("/(professional)/(account)/public-profile-2");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "#ffffff" }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Profile1Content
            nome={nome}
            onChangeNome={setNome}
            onBack={handleBack}
            cargo={cargo}
            experienceYears={experienceYears}
            profilePhotoUri={profilePhotoUri}
            cep={cep}
            logradouro={logradouro}
            numero={numero}
            complemento={complemento}
            bairro={bairro}
            cidade={cidade}
            estado={estado}
            raioAtuacaoKm={raioAtuacaoKm}
            cepLoading={cepLoading}
            onChangeCargo={setCargo}
            onChangeExperienceYears={setExperienceYears}
            onChangeCep={setCep}
            onChangeLogradouro={setLogradouro}
            onChangeNumero={setNumero}
            onChangeComplemento={setComplemento}
            onChangeBairro={setBairro}
            onChangeCidade={setCidade}
            onChangeEstado={setEstado}
            onChangeRaioAtuacaoKm={setRaioAtuacaoKm}
            onCepBlur={handleCepBlur}
            onPickPhoto={handlePickPhoto}
            onContinue={handleContinue}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
