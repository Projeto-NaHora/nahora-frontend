import React, { useState, useCallback } from "react";
import {
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
import { profileService } from "@/features/profile/service";

const REQUIREMENTS = [
  { label: "Mínimo de 8 caracteres", met: (s: string) => s.length >= 8 },
  {
    label: "Pelo menos uma letra maiúscula",
    met: (s: string) => /[A-Z]/.test(s),
  },
  { label: "Pelo menos um número", met: (s: string) => /\d/.test(s) },
  {
    label: "Pelo menos um caractere especial (!@#$%)",
    met: (s: string) => /[!@#$%]/.test(s),
  },
];

export default function PasswordScreen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [showAtual, setShowAtual] = useState(false);
  const [showNova, setShowNova] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!senhaAtual || !senhaNova || !confirmacao) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    if (senhaNova !== confirmacao) {
      Alert.alert("Erro", "As senhas não conferem.");
      return;
    }
    setSaving(true);
    try {
      await profileService.atualizarSenha({
        senhaAtual,
        senhaNova,
        confirmacaoNovaSenha: confirmacao,
      });
      Alert.alert("Sucesso", "Senha alterada com sucesso.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Erro",
        getApiErrorMessage(err, "Não foi possível alterar a senha."),
      );
    } finally {
      setSaving(false);
    }
  }, [senhaAtual, senhaNova, confirmacao]);

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
          Alterar Senha
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Description */}
        <Text style={styles.description}>
          Crie uma nova senha forte para manter sua{"\n"}
          conta segura. Sua nova senha deve ser diferente{"\n"}
          da anterior.
        </Text>

        <View style={styles.fields}>
          {/* Senha Atual */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Senha Atual</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.background,
                  borderColor: "#e5e7eb",
                },
              ]}
            >
              <IconSymbol name="lock" size={18} color="#8c8c8c" />
              <TextInput
                style={styles.input}
                value={senhaAtual}
                onChangeText={setSenhaAtual}
                placeholder="••••••••"
                placeholderTextColor="#6b7280"
                secureTextEntry={!showAtual}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowAtual(!showAtual)}>
                <IconSymbol
                  name={showAtual ? "eye.fill" : "eye.slash.fill"}
                  size={18}
                  color="#6b7280"
                />
              </Pressable>
            </View>
          </View>

          {/* Nova Senha */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Nova Senha</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.background,
                  borderColor: "#e5e7eb",
                },
              ]}
            >
              <IconSymbol name="lock" size={18} color="#8c8c8c" />
              <TextInput
                style={styles.input}
                value={senhaNova}
                onChangeText={setSenhaNova}
                placeholder="••••••••"
                placeholderTextColor="#6b7280"
                secureTextEntry={!showNova}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowNova(!showNova)}>
                <IconSymbol
                  name={showNova ? "eye.fill" : "eye.slash.fill"}
                  size={18}
                  color="#6b7280"
                />
              </Pressable>
            </View>
          </View>

          {/* Confirmar */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Confirmar Nova Senha</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.background,
                  borderColor: "#e5e7eb",
                },
              ]}
            >
              <IconSymbol name="lock" size={18} color="#8c8c8c" />
              <TextInput
                style={styles.input}
                value={confirmacao}
                onChangeText={setConfirmacao}
                placeholder="••••••••"
                placeholderTextColor="#6b7280"
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                <IconSymbol
                  name={showConfirm ? "eye.fill" : "eye.slash.fill"}
                  size={18}
                  color="#6b7280"
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.requirements}>
          <Text style={styles.requirementsTitle}>
            Sua senha deve conter:
          </Text>
          {REQUIREMENTS.map((req, i) => {
            const met = req.met(senhaNova);
            return (
              <View key={i} style={styles.reqRow}>
                <View
                  style={[
                    styles.reqDot,
                    {
                      backgroundColor: met ? "#e67215" : "#e5e7eb",
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.reqText,
                    { color: met ? colors.textPrimary : "#6b7280" },
                  ]}
                >
                  {req.label}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom */}
      <View
        style={[styles.bottomBar, { backgroundColor: colors.background }]}
      >
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Salvando..." : "Salvar Nova Senha"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 18,
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
  backButtonPressed: { opacity: 0.7 },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    textAlign: "center",
  },
  headerSpacer: { width: 44 },

  scroll: { flex: 1 },
  scrollContent: { padding: 28, gap: 28, paddingBottom: 40 },

  description: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 23,
    color: "#6b7280",
  },

  fields: { gap: 23 },

  fieldGroup: { gap: 7 },
  fieldLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 23,
    color: "#1f2937",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    height: 58,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 27,
    color: "#6b7280",
  },

  requirements: { gap: 12 },
  requirementsTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 23,
    color: "#1f2937",
    marginBottom: 4,
  },
  reqRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  reqDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  reqText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 23,
  },

  bottomBar: {
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  saveButton: {
    backgroundColor: "#f27a24",
    height: 62,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonPressed: { opacity: 0.85 },
  saveButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 28,
    color: "#ffffff",
  },
});
