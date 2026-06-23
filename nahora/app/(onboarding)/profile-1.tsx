import React, { useState, useEffect } from "react";
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

export default function Profile1() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [cepLoading, setCepLoading] = useState(false);

  const profession = useRegisterStore((state) => state.profession);
  const cpf = useRegisterStore((state) => state.cpf);
  const cargo = useRegisterStore((state) => state.cargo);
  const experienceYears = useRegisterStore((state) => state.experienceYears);
  const profilePhotoUri = useRegisterStore((state) => state.profilePhotoUri);
  const cep = useRegisterStore((state) => state.cep);
  const logradouro = useRegisterStore((state) => state.logradouro);
  const numero = useRegisterStore((state) => state.numero);
  const complemento = useRegisterStore((state) => state.complemento);
  const bairro = useRegisterStore((state) => state.bairro);
  const cidade = useRegisterStore((state) => state.cidade);
  const estado = useRegisterStore((state) => state.estado);
  const raioAtuacaoKm = useRegisterStore((state) => state.raioAtuacaoKm);
  const nome = useRegisterStore((state) => state.nome);
  const firstName = useRegisterStore((state) => state.firstName);
  const lastName = useRegisterStore((state) => state.lastName);

  const setCpf = useRegisterStore((state) => state.setCpf);
  const setCargo = useRegisterStore((state) => state.setCargo);
  const setExperienceYears = useRegisterStore((state) => state.setExperienceYears);
  const setProfilePhotoUri = useRegisterStore((state) => state.setProfilePhotoUri);
  const setCep = useRegisterStore((state) => state.setCep);
  const setLogradouro = useRegisterStore((state) => state.setLogradouro);
  const setNumero = useRegisterStore((state) => state.setNumero);
  const setComplemento = useRegisterStore((state) => state.setComplemento);
  const setBairro = useRegisterStore((state) => state.setBairro);
  const setCidade = useRegisterStore((state) => state.setCidade);
  const setEstado = useRegisterStore((state) => state.setEstado);
  const setLatitude = useRegisterStore((state) => state.setLatitude);
  const setLongitude = useRegisterStore((state) => state.setLongitude);
  const setRaioAtuacaoKm = useRegisterStore((state) => state.setRaioAtuacaoKm);
  const setNome = useRegisterStore((state) => state.setNome);
  const setName = useRegisterStore((state) => state.setName);

  useEffect(() => {
    if (!cargo && profession?.label) {
      setCargo(profession.label);
    }
  }, []);

  useEffect(() => {
    if (!nome && (firstName || lastName)) {
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) {
        setNome(fullName);
      }
    }
  }, []);

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
      // silently ignore CEP lookup errors
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
        if (coords) {
          setLatitude(coords.lat);
          setLongitude(coords.lng);
        }
      } catch {
        // proceed even if geocoding fails
      }
    }
    router.push("/(onboarding)/profile-2");
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
            nome={nome}
            onChangeNome={setNome}
            cpf={cpf}
            onChangeCpf={setCpf}
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
            onChangeCpf={setCpf}
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
