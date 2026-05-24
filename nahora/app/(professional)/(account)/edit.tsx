import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { EditProfileContent } from "@/features/profile/components/EditProfileContent";
import {
  useProfileQuery,
  useUpdateProfile,
} from "@/features/profile/hooks/useProfile";
import { getApiErrorMessage } from "@/utils/apiError";
import type { EditProfileFormValues } from "@/features/profile/types";

export default function EditProfileScreen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: profile, isLoading } = useProfileQuery();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const handleSubmit = async (data: EditProfileFormValues) => {
    try {
      await updateProfile({
        nome: data.fullName,
        email: data.email,
        telefone: data.phone,
        cidade: data.city,
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        "Erro ao atualizar perfil",
      );
      Alert.alert("Erro", errorMessage);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert("Alterar Foto", "Funcionalidade em desenvolvimento", [
      {
        text: "OK",
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Editar perfil
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <EditProfileContent
        initialData={
          profile
            ? {
                fullName: profile.nome,
                email: profile.email,
                phone: profile.telefone,
                city: profile.cidade,
                photoUrl: profile.fotoPerfil,
              }
            : undefined
        }
        isLoading={isLoading || isUpdating}
        onSubmit={handleSubmit}
        onChangePhoto={handleChangePhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonIcon: {
    fontSize: 20,
    color: "#1C1C1E",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 27,
    letterSpacing: -0.44,
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },
});
