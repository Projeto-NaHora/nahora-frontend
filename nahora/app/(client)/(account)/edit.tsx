import React, { useReducer, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Fonts } from "@/constants/theme";
import { getApiErrorMessage } from "@/utils/apiError";
import { useEditClientProfile } from "@/features/profile/hooks/useEditClientProfile";
import { profileService } from "@/features/profile/service";

// ── Form reducer (one dispatch instead of 3 cascading setStates) ────────────

interface FormState {
  nome: string;
  email: string;
  telefone: string;
  dirty: boolean;
}

type FormAction =
  | { type: "INIT"; nome: string; email: string; telefone: string }
  | { type: "SET_FIELD"; field: "nome" | "email" | "telefone"; value: string };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "INIT":
      return {
        nome: action.nome,
        email: action.email,
        telefone: action.telefone,
        dirty: false,
      };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value, dirty: true };
  }
}

const initialForm: FormState = { nome: "", email: "", telefone: "", dirty: false };

export default function EditScreen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const { profile, isLoading, error, salvar, retry } = useEditClientProfile();

  const [form, dispatch] = useReducer(formReducer, initialForm);

  // Single dispatch to pre-fill — no cascade
  useEffect(() => {
    if (profile) {
      dispatch({
        type: "INIT",
        nome: profile.nome ?? "",
        email: profile.email ?? "",
        telefone: profile.telefone ?? "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await salvar({ nome: form.nome, email: form.email, telefone: form.telefone });
      dispatch({ type: "INIT", nome: form.nome, email: form.email, telefone: form.telefone });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      const msg = getApiErrorMessage(err, "Erro ao salvar.");
      Alert.alert("Erro", msg);
    }
  };

  const initials = (profile?.nome ?? "?")
    .split(" ")
    .map((n) => n[0])
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .join("")
    .toUpperCase();

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (error) {
    console.error("[E01] Erro ao carregar perfil para edição:", error);
    const mensagem = getApiErrorMessage(
      error,
      "Erro de conexão com o servidor",
    );
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          Não foi possível carregar seus dados
        </Text>
        <Text style={[styles.errorDetail, { color: colors.textSecondary }]}>
          {mensagem}
        </Text>
        <Pressable
          onPress={() => retry()}
          style={({ pressed }) => [
            styles.retryButton,
            { backgroundColor: colors.brand },
            pressed && styles.retryButtonPressed,
          ]}
        >
          <Text style={[styles.retryButtonText, { color: colors.onBrand }]}>
            Tentar novamente
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: "rgba(244,244,245,0.6)" },
            pressed && styles.backButtonPressed,
          ]}
        >
          <IconSymbol name="chevron.left" size={20} color="#1c1c1e" />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Editar perfil
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll}>
        {/* Photo section */}
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.cameraBadge}>
              <IconSymbol name="edit" size={14} color="#ffffff" />
            </View>
          </View>

          <Pressable style={styles.alterarFotoButton}>
            <Text style={styles.alterarFotoText}>Alterar foto</Text>
          </Pressable>
        </View>

        {/* Form fields */}
        <View style={styles.formContainer}>
          {/* Nome completo */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Nome completo</Text>
            <View style={[styles.inputWrapper, { borderColor: "#eaeaea" }]}>
              <TextInput
                style={[styles.input, { color: "#2c2c2c" }]}
                value={form.nome}
                onChangeText={(t) =>
                  dispatch({ type: "SET_FIELD", field: "nome", value: t })
                }
                placeholder="Nome completo"
                placeholderTextColor="#9ca3af"
                autoComplete="name"
              />
            </View>
          </View>

          {/* E-mail */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>E-mail</Text>
            <View style={[styles.inputWrapper, { borderColor: "#eaeaea" }]}>
              <TextInput
                style={[styles.input, { color: "#2c2c2c" }]}
                value={form.email}
                onChangeText={(t) =>
                  dispatch({ type: "SET_FIELD", field: "email", value: t })
                }
                placeholder="E-mail"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Celular */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Celular</Text>
            <View style={[styles.inputWrapper, { borderColor: "#eaeaea" }]}>
              <TextInput
                style={[styles.input, { color: "#2c2c2c" }]}
                value={form.telefone}
                onChangeText={(t) =>
                  dispatch({ type: "SET_FIELD", field: "telefone", value: t })
                }
                placeholder="Celular"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View
        style={[styles.bottomBar, { backgroundColor: colors.background }]}
      >
        <Pressable
          onPress={handleSave}
          disabled={!form.dirty}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: form.dirty ? "#e67215" : "#d1d5db",
              boxShadow: form.dirty ? "0 4px 12px rgba(230,114,21,0.2)" : undefined,
            },
            pressed && form.dirty && styles.saveButtonPressed,
          ]}
        >
          <Text
            style={[
              styles.saveButtonText,
              { color: form.dirty ? "#ffffff" : "#9ca3af" },
            ]}
          >
            Salvar alterações
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorText: {
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
    textAlign: "center",
  },
  errorDetail: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 27,
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },

  // Scroll
  scroll: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },

  // Photo section
  photoSection: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 24,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#fff2e5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: Fonts?.sans,
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 48,
    color: "#e67215",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e67215",
    borderWidth: 2,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  alterarFotoButton: {
    marginTop: 12,
  },
  alterarFotoText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    color: "#e67215",
  },

  // Form
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 20,
    paddingBottom: 24,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    color: "#4b4b4b",
    paddingLeft: 2,
  },
  inputWrapper: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 14,
    height: 56,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  input: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22.5,
  },

  // Bottom bar
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
});
