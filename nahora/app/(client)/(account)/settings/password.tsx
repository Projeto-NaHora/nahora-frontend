// app/(client)/(account)/settings/password.tsx
//
// F08 — Alterar Senha
// Design reference: Figma node 725:544
//
// Layout:
//   1. Header (back button + "Alterar senha" + spacer)
//   2. Descriptive text
//   3. 3 password fields (senha atual, nova, confirmar)
//   4. Password requirements card (regras visuais)
//   5. Fixed bottom button "Salvar Nova Senha"
//      — enabled only when all rules pass, all fields filled,
//        and confirmation matches new password.

import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import { PasswordInput } from "@/components/ui/password-input";
import { Snackbar } from "@/components/ui/Snackbar";
import { useChangePassword } from "@/features/settings/hooks/useChangePassword";

// ---------------------------------------------------------------------------
// Design tokens (from Figma 725:544)
// ---------------------------------------------------------------------------
const Tokens = {
  bg: "#ffffff",
  headerBorder: "#e5e7eb",
  backBtnBg: "rgba(244,244,245,0.6)",
  headingColor: "#1c1c1e",
  descColor: "#6b7280",
  labelColor: "#1f2937",
  inputBg: "#ffffff",
  inputBorder: "#e5e7eb",
  inputRadius: 14,
  inputPlaceholder: "#6b7280",
  rulesBg: "rgba(255,247,237,0.5)",
  rulesBorder: "#fff7ed",
  rulesRadius: 27,
  rulesTitle: "#1f2937",
  rulesText: "#6b7280",
  rulesIconPassed: "rgba(242,122,36,0.2)",
  rulesIconDefault: "#e5e7eb",
  rulesIconCheck: "#f27a24",
  rulesIconDash: "#6b7280",
  btnBg: "#f27a24",
  btnBgDisabled: "#fcd3a8",
  btnText: "#ffffff",
  btnRadius: 27,
  fontFamily: "Inter",
} as const;

// ---------------------------------------------------------------------------
// Password rules
// ---------------------------------------------------------------------------
interface Rule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const PASSWORD_RULES: Rule[] = [
  {
    id: "minLength",
    label: "Pelo menos 8 caracteres",
    test: (p) => p.length >= 8,
  },
  {
    id: "uppercase",
    label: "Pelo menos uma letra maiúscula",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "number",
    label: "Pelo menos um número",
    test: (p) => /[0-9]/.test(p),
  },
  {
    id: "special",
    label: "Pelo menos um caractere especial\n(!@#$%)",
    test: (p) => /[!@#$%]/.test(p),
  },
];

// ---------------------------------------------------------------------------
// Icons (inline SVG as View)
// ---------------------------------------------------------------------------

function IconChevronLeft() {
  return (
    <View
      style={{
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderStyle: "solid",
          borderTopColor: "transparent",
          borderRightColor: "transparent",
          borderBottomWidth: 2,
          borderLeftWidth: 2,
          borderBottomColor: "#1c1c1e",
          borderLeftColor: "#1c1c1e",
          transform: [{ rotate: "45deg" }],
          marginLeft: 4,
        }}
      />
    </View>
  );
}

function IconLock({ color = "#6b7280" }: { color?: string }) {
  return (
    <View
      style={{
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 14,
          height: 12,
          borderRadius: 3,
          borderWidth: 1.7,
          borderColor: color,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            width: 6,
            height: 5,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            borderWidth: 1.7,
            borderColor: color,
            borderBottomWidth: 0,
            position: "absolute",
            top: -6,
          }}
        />
      </View>
    </View>
  );
}

function IconCheck({ color = "#f27a24" }: { color?: string }) {
  return (
    <View
      style={{
        width: 11,
        height: 11,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 8,
          height: 5,
          borderLeftWidth: 1.7,
          borderBottomWidth: 1.7,
          borderColor: color,
          borderStyle: "solid",
          transform: [{ rotate: "-45deg" }],
          marginTop: -2,
        }}
      />
    </View>
  );
}

function IconDash({ color = "#6b7280" }: { color?: string }) {
  return (
    <View
      style={{
        width: 7,
        height: 0,
        borderTopWidth: 1.7,
        borderColor: color,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Rule row component
// ---------------------------------------------------------------------------
function RuleRow({ label, passed }: { label: string; passed: boolean }) {
  return (
    <View style={styles.ruleRow}>
      <View
        style={[
          styles.ruleIcon,
          {
            backgroundColor: passed
              ? Tokens.rulesIconPassed
              : Tokens.rulesIconDefault,
          },
        ]}
      >
        {passed ? <IconCheck /> : <IconDash />}
      </View>
      <Text style={styles.ruleLabel}>{label}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function Password() {
  const router = useRouter();
  const { alterarSenha, loading } = useChangePassword();

  // --- Form state ---
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // --- Snackbar state ---
  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    message: string;
    isError: boolean;
  }>({ visible: false, message: "", isError: false });

  const showSnackbar = useCallback((message: string, isError = false) => {
    setSnackbar({ visible: true, message, isError });
  }, []);

  const dismissSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, visible: false }));
  }, []);

  // --- Validation ---
  const rulesResults = useMemo(
    () => PASSWORD_RULES.map((rule) => rule.test(novaSenha)),
    [novaSenha],
  );

  const allRulesPassed = useMemo(
    () => rulesResults.every(Boolean),
    [rulesResults],
  );

  const isBtnEnabled = useMemo(() => {
    return (
      senhaAtual.length > 0 &&
      novaSenha.length > 0 &&
      confirmarSenha.length > 0 &&
      allRulesPassed &&
      novaSenha === confirmarSenha
    );
  }, [senhaAtual, novaSenha, confirmarSenha, allRulesPassed]);

  const showConfirmError = useMemo(() => {
    return confirmarSenha.length > 0 && confirmarSenha !== novaSenha;
  }, [confirmarSenha, novaSenha]);

  // --- Submit ---
  const handleSubmit = useCallback(async () => {
    if (!isBtnEnabled || loading) return;

    const err = await alterarSenha({ senhaAtual, novaSenha });
    if (err) {
      showSnackbar(err, true);
    } else {
      showSnackbar("Senha alterada com sucesso!", false);
      // Navega de volta após 1.5s
      setTimeout(() => {
        router.back();
      }, 1500);
    }
  }, [
    isBtnEnabled,
    loading,
    alterarSenha,
    senhaAtual,
    novaSenha,
    showSnackbar,
    router,
  ]);

  // --- Render ---
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <IconChevronLeft />
        </TouchableOpacity>
        <Text style={styles.heading}>Alterar senha</Text>
        {/* Spacer to balance the back button */}
        <View style={{ width: 44, height: 44 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Descriptive text */}
        <View style={styles.descContainer}>
          <Text style={styles.descText}>
            Crie uma nova senha forte para manter sua{"\n"}
            conta segura. Sua nova senha deve ser diferente{"\n"}
            da anterior.
          </Text>
        </View>

        {/* Password fields */}
        <View style={styles.fieldsContainer}>
          {/* Senha Atual */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Senha Atual</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconLeft}>
                <IconLock />
              </View>
              <PasswordInput
                value={senhaAtual}
                onChangeText={setSenhaAtual}
                placeholder="••••••••"
                placeholderTextColor={Tokens.inputPlaceholder}
                style={styles.input}
              />
            </View>
          </View>

          {/* Nova Senha */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Nova Senha</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconLeft}>
                <IconLock />
              </View>
              <PasswordInput
                value={novaSenha}
                onChangeText={setNovaSenha}
                placeholder="••••••••"
                placeholderTextColor={Tokens.inputPlaceholder}
                style={styles.input}
              />
            </View>
          </View>

          {/* Confirmar Nova Senha */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Confirmar Nova Senha</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconLeft}>
                <IconLock />
              </View>
              <PasswordInput
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                placeholder="••••••••"
                placeholderTextColor={Tokens.inputPlaceholder}
                style={styles.input}
              />
            </View>
            {showConfirmError && (
              <Text style={styles.confirmError}>As senhas não conferem</Text>
            )}
          </View>
        </View>

        {/* Password requirements */}
        <View style={styles.rulesContainer}>
          <View style={styles.rulesCard}>
            <Text style={styles.rulesTitle}>Sua senha deve conter:</Text>
            <View style={styles.rulesList}>
              {PASSWORD_RULES.map((rule, index) => (
                <RuleRow
                  key={rule.id}
                  label={rule.label}
                  passed={rulesResults[index]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Bottom spacer for fixed button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed bottom button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.submitBtn,
            {
              backgroundColor: isBtnEnabled
                ? Tokens.btnBg
                : Tokens.btnBgDisabled,
            },
          ]}
          activeOpacity={0.7}
          onPress={handleSubmit}
          disabled={!isBtnEnabled || loading}
        >
          {loading ? (
            <ActivityIndicator color={Tokens.btnText} size="small" />
          ) : (
            <Text style={styles.submitBtnText}>Salvar Nova Senha</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Snackbar */}
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        isError={snackbar.isError}
        onDismiss={dismissSnackbar}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Tokens.bg,
  },

  // -- Header --
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 64 : 44,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: Tokens.headerBorder,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Tokens.backBtnBg,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontFamily: Tokens.fontFamily,
    fontSize: 24,
    fontWeight: "700",
    color: Tokens.headingColor,
    letterSpacing: -0.45,
    lineHeight: 27,
  },

  // -- Scroll --
  scroll: {
    flex: 1,
  },
  scrollContent: {
    // no extra padding top needed — handled by margin after header
  },

  // -- Description --
  descContainer: {
    paddingTop: 9,
    paddingHorizontal: 27,
    paddingBottom: 37,
  },
  descText: {
    fontFamily: Tokens.fontFamily,
    fontSize: 16,
    fontWeight: "400",
    color: Tokens.descColor,
    lineHeight: 23,
    letterSpacing: 0,
  },

  // -- Fields --
  fieldsContainer: {
    paddingHorizontal: 27,
    gap: 23,
  },
  fieldWrapper: {
    gap: 7,
  },
  fieldLabel: {
    fontFamily: Tokens.fontFamily,
    fontSize: 16,
    fontWeight: "500",
    color: Tokens.labelColor,
    lineHeight: 23,
    letterSpacing: 0,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  inputIconLeft: {
    position: "absolute",
    left: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  input: {
    fontFamily: Tokens.fontFamily,
    fontSize: 18,
    fontWeight: "400",
    color: "#111111",
    lineHeight: 27,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 46,
    paddingRight: 14,
    backgroundColor: Tokens.inputBg,
    borderRadius: Tokens.inputRadius,
    borderWidth: 1,
    borderColor: Tokens.inputBorder,
  },
  confirmError: {
    fontFamily: Tokens.fontFamily,
    fontSize: 14,
    fontWeight: "400",
    color: "#DC2626",
    marginTop: 4,
    marginLeft: 4,
  },

  // -- Rules --
  rulesContainer: {
    paddingTop: 37,
    paddingHorizontal: 27,
  },
  rulesCard: {
    backgroundColor: Tokens.rulesBg,
    borderRadius: Tokens.rulesRadius,
    borderWidth: 1,
    borderColor: Tokens.rulesBorder,
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 14,
  },
  rulesTitle: {
    fontFamily: Tokens.fontFamily,
    fontSize: 16,
    fontWeight: "600",
    color: Tokens.rulesTitle,
    lineHeight: 23,
    letterSpacing: 0,
  },
  rulesList: {
    gap: 9,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  ruleIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  ruleLabel: {
    fontFamily: Tokens.fontFamily,
    fontSize: 16,
    fontWeight: "400",
    color: Tokens.rulesText,
    lineHeight: 23,
    letterSpacing: 0,
    flex: 1,
  },

  // -- Bottom bar --
  bottomBar: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: Tokens.headerBorder,
    paddingTop: 18,
    paddingBottom: Platform.OS === "ios" ? 36 : 18,
    paddingHorizontal: 27,
  },
  submitBtn: {
    height: 62,
    borderRadius: Tokens.btnRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    fontFamily: Tokens.fontFamily,
    fontSize: 16,
    fontWeight: "600",
    color: Tokens.btnText,
    lineHeight: 22,
    letterSpacing: 0,
  },
});
