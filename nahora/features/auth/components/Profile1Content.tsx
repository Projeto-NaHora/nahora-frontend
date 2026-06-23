import React, { useState, useCallback } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { formatCep, formatCpf } from "@/utils/formatters";
import { ProfileStepIndicator } from "./ProfileStepIndicator";

type Profile1ContentProps = {
  nome: string;
  cpf: string;
  cargo: string;
  experienceYears: string;
  profilePhotoUri: string | null;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  raioAtuacaoKm: string;
  cepLoading: boolean;
  onChangeNome: (value: string) => void;
  onChangeCpf: (value: string) => void;
  onChangeCargo: (value: string) => void;
  onChangeExperienceYears: (value: string) => void;
  onChangeCep: (value: string) => void;
  onChangeLogradouro: (value: string) => void;
  onChangeNumero: (value: string) => void;
  onChangeComplemento: (value: string) => void;
  onChangeBairro: (value: string) => void;
  onChangeCidade: (value: string) => void;
  onChangeEstado: (value: string) => void;
  onChangeRaioAtuacaoKm: (value: string) => void;
  onCepBlur: () => void;
  onPickPhoto: () => void;
  onContinue: () => void;
  onBack?: () => void;
};

type TouchedFields = {
  nome: boolean;
  cpf: boolean;
  cargo: boolean;
  cep: boolean;
  logradouro: boolean;
  numero: boolean;
  bairro: boolean;
  cidade: boolean;
  estado: boolean;
  experienceYears: boolean;
  raioAtuacaoKm: boolean;
};

export function Profile1Content({
  nome,
  cpf,
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
  cepLoading,
  onChangeNome,
  onChangeCpf,
  onChangeCargo,
  onChangeExperienceYears,
  onChangeCep,
  onChangeLogradouro,
  onChangeNumero,
  onChangeComplemento,
  onChangeBairro,
  onChangeCidade,
  onChangeEstado,
  onChangeRaioAtuacaoKm,
  onCepBlur,
  onPickPhoto,
  onContinue,
  onBack,
}: Profile1ContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const [touched, setTouched] = useState<TouchedFields>({
    nome: false,
    cpf: false,
    cargo: false,
    cep: false,
    logradouro: false,
    numero: false,
    bairro: false,
    cidade: false,
    estado: false,
    experienceYears: false,
    raioAtuacaoKm: false,
  });

  const touch = useCallback((field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const isCpfValid = cpf.replace(/\D/g, "").length === 11;
  const isCargoValid = cargo.trim().length >= 4;
  const isCepValid = cep.replace(/\D/g, "").length === 8;
  const isLogradouroValid = logradouro.trim().length >= 3;
  const isNumeroValid = numero.trim().length >= 1;
  const isBairroValid = bairro.trim().length >= 2;
  const isCidadeValid = cidade.trim().length >= 3;
  const isEstadoValid = estado.trim().length === 2;
  const isAddressValid =
    isLogradouroValid &&
    isNumeroValid &&
    isBairroValid &&
    isCidadeValid &&
    isEstadoValid;
  const isExperienceValid = /^\d+$/.test(experienceYears);
  const isRaioValid =
    /^\d+$/.test(raioAtuacaoKm) && parseInt(raioAtuacaoKm, 10) > 0;
  const isNomeValid = (nome ?? "").trim().length >= 3;
  const isValid =
    isNomeValid &&
    isCpfValid &&
    isCargoValid &&
    isCepValid &&
    isAddressValid &&
    isExperienceValid &&
    isRaioValid;

  const fieldBorder = (field: keyof TouchedFields, valid: boolean) => {
    if (!touched[field]) return colors.border;
    return valid ? colors.border : (colors.error ?? "#dc2626");
  };

  const handleCpfChange = (text: string) => {
    onChangeCpf(text.replace(/\D/g, "").slice(0, 11));
  };

  const handleCepChange = (text: string) => {
    onChangeCep(text.replace(/\D/g, "").slice(0, 8));
  };

  const handleExperienceYearsChange = (text: string) => {
    onChangeExperienceYears(text.replace(/\D/g, ""));
  };

  const handleRaioChange = (text: string) => {
    onChangeRaioAtuacaoKm(text.replace(/\D/g, ""));
  };

  return (
    <View style={[styles.container, { backgroundColor: "#ffffff" }]}>
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
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Nome
          </Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <Text style={styles.inputIcon}>👤</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: fieldBorder("nome", isNomeValid),
                },
              ]}
              placeholder="Seu nome completo"
              placeholderTextColor={colors.placeholder}
              value={nome}
              onChangeText={onChangeNome}
              onBlur={() => touch("nome")}
              autoCapitalize="words"
            />
          </View>
          {touched.nome && !isNomeValid && (
            <Text
              style={[styles.fieldError, { color: colors.error ?? "#dc2626" }]}
            >
              Mínimo 3 caracteres
            </Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            CPF
          </Text>
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
                  borderColor: fieldBorder("cpf", isCpfValid),
                },
              ]}
              placeholder="000.000.000-00"
              placeholderTextColor={colors.placeholder}
              value={formatCpf(cpf)}
              onChangeText={handleCpfChange}
              onBlur={() => touch("cpf")}
              keyboardType="number-pad"
              maxLength={14}
            />
          </View>
          {touched.cpf && !isCpfValid && (
            <Text
              style={[styles.fieldError, { color: colors.error ?? "#dc2626" }]}
            >
              CPF deve ter 11 dígitos
            </Text>
          )}
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
                  borderColor: fieldBorder("cargo", isCargoValid),
                },
              ]}
              placeholder="ex. Eletricista"
              placeholderTextColor={colors.placeholder}
              value={cargo}
              onChangeText={onChangeCargo}
              onBlur={() => touch("cargo")}
            />
          </View>
          {touched.cargo && !isCargoValid && (
            <Text
              style={[styles.fieldError, { color: colors.error ?? "#dc2626" }]}
            >
              Mínimo 4 caracteres
            </Text>
          )}
        </View>

        {/* CEP + address fields */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>CEP</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              {cepLoading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.brand}
                  style={{ width: 18, height: 18 }}
                />
              ) : (
                <Text style={styles.inputIcon}>📮</Text>
              )}
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: fieldBorder("cep", isCepValid),
                },
              ]}
              placeholder="00000-000"
              placeholderTextColor={colors.placeholder}
              value={formatCep(cep)}
              onChangeText={handleCepChange}
              onBlur={() => {
                touch("cep");
                onCepBlur();
              }}
              keyboardType="number-pad"
              maxLength={9}
            />
          </View>
          {touched.cep && !isCepValid && (
            <Text
              style={[styles.fieldError, { color: colors.error ?? "#dc2626" }]}
            >
              CEP deve ter 8 dígitos
            </Text>
          )}
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.fieldGroupExpanded}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Logradouro
            </Text>
            <TextInput
              style={[
                styles.inputSimple,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: fieldBorder("logradouro", isLogradouroValid),
                },
              ]}
              placeholder="Rua / Avenida"
              placeholderTextColor={colors.placeholder}
              value={logradouro}
              onChangeText={onChangeLogradouro}
              onBlur={() => touch("logradouro")}
            />
          </View>
          <View style={styles.fieldGroupNarrow}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Número
            </Text>
            <TextInput
              style={[
                styles.inputSimple,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: fieldBorder("numero", isNumeroValid),
                },
              ]}
              placeholder="123"
              placeholderTextColor={colors.placeholder}
              value={numero}
              onChangeText={onChangeNumero}
              onBlur={() => touch("numero")}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Complemento
          </Text>
          <TextInput
            style={[
              styles.inputSimple,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            placeholder="Apto, Bloco, etc. (opcional)"
            placeholderTextColor={colors.placeholder}
            value={complemento}
            onChangeText={onChangeComplemento}
          />
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.fieldGroupHalf}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Bairro
            </Text>
            <TextInput
              style={[
                styles.inputSimple,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: fieldBorder("bairro", isBairroValid),
                },
              ]}
              placeholder="Bairro"
              placeholderTextColor={colors.placeholder}
              value={bairro}
              onChangeText={onChangeBairro}
              onBlur={() => touch("bairro")}
            />
          </View>
          <View style={styles.fieldGroupHalf}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Cidade
            </Text>
            <TextInput
              style={[
                styles.inputSimple,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: fieldBorder("cidade", isCidadeValid),
                },
              ]}
              placeholder="Cidade"
              placeholderTextColor={colors.placeholder}
              value={cidade}
              onChangeText={onChangeCidade}
              onBlur={() => touch("cidade")}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Estado
          </Text>
          <TextInput
            style={[
              styles.inputSimple,
              { width: 80 },
              {
                color: colors.textPrimary,
                backgroundColor: colors.surface,
                borderColor: fieldBorder("estado", isEstadoValid),
              },
            ]}
            placeholder="UF"
            placeholderTextColor={colors.placeholder}
            value={estado}
            onChangeText={(t) => onChangeEstado(t.toUpperCase().slice(0, 2))}
            onBlur={() => touch("estado")}
            maxLength={2}
            autoCapitalize="characters"
          />
          {touched.estado && !isEstadoValid && (
            <Text
              style={[styles.fieldError, { color: colors.error ?? "#dc2626" }]}
            >
              Use a sigla do estado (ex: SP)
            </Text>
          )}
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
                    borderColor: fieldBorder(
                      "experienceYears",
                      isExperienceValid,
                    ),
                  },
                ]}
                placeholder="ex. 8"
                placeholderTextColor={colors.placeholder}
                value={experienceYears}
                onChangeText={handleExperienceYearsChange}
                onBlur={() => touch("experienceYears")}
                keyboardType="number-pad"
              />
            </View>
            {touched.experienceYears && !isExperienceValid && (
              <Text
                style={[
                  styles.fieldError,
                  { color: colors.error ?? "#dc2626" },
                ]}
              >
                Informe os anos de experiência
              </Text>
            )}
          </View>
          <View style={styles.fieldGroupHalf}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Raio de Atuação (km)
            </Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Text style={styles.inputIcon}>📏</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.surface,
                    borderColor: fieldBorder("raioAtuacaoKm", isRaioValid),
                  },
                ]}
                placeholder="ex. 20"
                placeholderTextColor={colors.placeholder}
                value={raioAtuacaoKm}
                onChangeText={handleRaioChange}
                onBlur={() => touch("raioAtuacaoKm")}
                keyboardType="number-pad"
              />
            </View>
            {touched.raioAtuacaoKm && !isRaioValid && (
              <Text
                style={[
                  styles.fieldError,
                  { color: colors.error ?? "#dc2626" },
                ]}
              >
                Informe um raio maior que 0 km
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.bottomBar}>
        {onBack && (
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={({ pressed }) => [
              styles.outlineButton,
              { borderColor: colors.border },
              pressed && styles.buttonPressed,
            ]}
          >
            <Text
              style={[styles.outlineButtonText, { color: colors.textPrimary }]}
            >
              Voltar
            </Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          disabled={!isValid}
          onPress={onContinue}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: isValid ? colors.brand : colors.surface,
            },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text
            style={[
              styles.primaryButtonText,
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
    flex: 1,
  },
  fieldGroupExpanded: {
    gap: 6,
    flex: 2,
  },
  fieldGroupNarrow: {
    gap: 6,
    flex: 1,
    marginLeft: 12,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 12,
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
  inputSimple: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 14,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  bottomBar: {
    flexDirection: "row",
    gap: 16,
    marginTop: 32,
    marginBottom: 24,
  },
  outlineButton: {
    flex: 1,
    height: 54,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  primaryButton: {
    flex: 1,
    height: 54,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  fieldError: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  arrowIcon: {
    fontSize: 18,
    fontWeight: "500",
  },
});
