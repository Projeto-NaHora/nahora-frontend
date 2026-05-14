import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatCpf, isValidCpf, unformatCpf } from "@/utils/formatters";
import { ProfileStepIndicator } from "./ProfileStepIndicator";

type Profile1ContentProps = {
  cpf: string;
  cargo: string;
  location: string;
  experienceYears: string;
  profilePhotoUri: string | null;
  onChangeCpf: (value: string) => void;
  onChangeCargo: (value: string) => void;
  onChangeLocation: (value: string) => void;
  onChangeExperienceYears: (value: string) => void;
  onPickPhoto: () => void;
  onContinue: () => void;
};

export function Profile1Content({
  cpf,
  cargo,
  location,
  experienceYears,
  profilePhotoUri,
  onChangeCpf,
  onChangeCargo,
  onChangeLocation,
  onChangeExperienceYears,
  onPickPhoto,
  onContinue,
}: Profile1ContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const formattedCpf = formatCpf(cpf);
  const isCpfValid = isValidCpf(cpf);
  const isCargoValid = cargo.trim().length >= 4;
  const isLocationValid = location.trim().length >= 4;
  const isExperienceValid = /^\d+$/.test(experienceYears);
  const isValid =
    isCpfValid && isCargoValid && isLocationValid && isExperienceValid;

  const handleCpfChange = (text: string) => {
    onChangeCpf(unformatCpf(text));
  };

  const handleExperienceYearsChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    onChangeExperienceYears(digits);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ProfileStepIndicator currentStep={1} />

      <Text style={[styles.heading, { color: colors.textPrimary }]}>
        Detalhes Pessoais
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Deixe os clientes saberem quem você é e o que você faz.
      </Text>

      <View style={styles.photoSection}>
        <View style={styles.photoWrapper}>
          <View
            style={[styles.photoCircle, { backgroundColor: colors.surface }]}
          >
            {profilePhotoUri ? (
              <Image
                source={{ uri: profilePhotoUri }}
                style={styles.photoImage}
              />
            ) : (
              <View style={styles.userIconContainer}>
                <View
                  style={[styles.userIconHead, { borderColor: colors.brand }]}
                />
                <View
                  style={[styles.userIconBody, { borderColor: colors.brand }]}
                />
              </View>
            )}
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={onPickPhoto}
            style={({ pressed }) => [
              styles.cameraButton,
              { backgroundColor: colors.brand, borderColor: colors.background },
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.cameraIcon}>📷</Text>
          </Pressable>
        </View>
        <Pressable accessibilityRole="button" onPress={onPickPhoto}>
          <Text style={[styles.addPhotoText, { color: colors.brand }]}>
            Adicionar Foto
          </Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Cpf</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <Text style={styles.inputIcon}>🪪</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              placeholder="ex. 999.999.999-00"
              placeholderTextColor={colors.placeholder}
              value={formattedCpf}
              onChangeText={handleCpfChange}
              keyboardType="number-pad"
              maxLength={14}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Profissão / Cargo
          </Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <Text style={styles.inputIcon}>💼</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              placeholder="ex. Eletricista"
              placeholderTextColor={colors.placeholder}
              value={cargo}
              onChangeText={onChangeCargo}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Localização
          </Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <Text style={styles.inputIcon}>📍</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Cidade, Estado"
              placeholderTextColor={colors.placeholder}
              value={location}
              onChangeText={onChangeLocation}
            />
          </View>
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.fieldGroupHalf}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Experiência (Anos)
            </Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Text style={styles.inputIcon}>⏱️</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="ex. 8"
                placeholderTextColor={colors.placeholder}
                value={experienceYears}
                onChangeText={handleExperienceYearsChange}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <Pressable
          accessibilityRole="button"
          disabled={!isValid}
          onPress={onContinue}
          style={({ pressed }) => [
            styles.continueButton,
            {
              backgroundColor: isValid ? colors.brand : colors.surface,
            },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text
            style={[
              styles.continueText,
              { color: isValid ? colors.onBrand : colors.textSecondary },
            ]}
          >
            Próximo Passo
          </Text>
          <Text
            style={[
              styles.arrowIcon,
              { color: isValid ? colors.onBrand : colors.textSecondary },
            ]}
          >
            →
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    marginBottom: 24,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  photoWrapper: {
    position: "relative",
    marginBottom: 8,
  },
  photoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  photoImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  userIconContainer: {
    alignItems: "center",
  },
  userIconHead: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    marginBottom: 2,
  },
  userIconBody: {
    width: 30,
    height: 18,
    borderRadius: 15,
    borderWidth: 2.5,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  cameraIcon: {
    fontSize: 14,
  },
  addPhotoText: {
    fontSize: 14,
    fontWeight: "500",
  },
  form: {
    gap: 20,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldGroupHalf: {
    gap: 6,
    width: "50%",
  },
  fieldRow: {
    flexDirection: "row",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  inputIconContainer: {
    position: "absolute",
    left: 14,
    zIndex: 1,
  },
  inputIcon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 44,
    paddingRight: 14,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  bottomBar: {
    marginTop: 32,
    marginBottom: 24,
  },
  continueButton: {
    height: 54,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  continueText: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  arrowIcon: {
    fontSize: 18,
    fontWeight: "500",
  },
});
