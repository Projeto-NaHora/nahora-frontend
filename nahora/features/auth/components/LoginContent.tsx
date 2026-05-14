import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Controller, type Control } from "react-hook-form";

import {
  Borders,
  Colors,
  FontSizes,
  Fonts,
  LetterSpacing,
  LineHeights,
  Radii,
  Sizes,
  Spacing,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthScreenShell } from "./AuthScreenShell";
import type { LoginFormValues } from "../types";

type LoginContentProps = {
  control: Control<LoginFormValues>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
};

export function LoginContent({
  control,
  isSubmitting,
  onSubmit,
  onForgotPassword,
  onRegister,
}: LoginContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const footer = (
    <View style={styles.signupRow}>
      <Text style={[styles.signupText, { color: colors.textPrimary }]}>
        Não tem uma conta?
      </Text>
      <Pressable onPress={onRegister} style={styles.signupLink}>
        <Text style={[styles.signupLinkText, { color: colors.link }]}>
          Cadastre-se
        </Text>
      </Pressable>
    </View>
  );

  return (
    <AuthScreenShell title={"Bem-vindo(a)\nde volta!"} footer={footer}>
      <View style={styles.formFields}>
        <Controller
          control={control}
          name="identificador"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="E-mail ou número de telefone"
              placeholderTextColor={colors.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              textContentType="username"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="Senha"
              placeholderTextColor={colors.placeholder}
              textContentType="password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </View>

      <Pressable onPress={onForgotPassword} style={styles.forgotPassword}>
        <Text style={[styles.forgotPasswordText, { color: colors.link }]}>
          Esqueceu a senha?
        </Text>
      </Pressable>

      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.brand },
          pressed && styles.buttonPressed,
          isSubmitting && styles.buttonDisabled,
        ]}
      >
        <Text style={[styles.buttonText, { color: colors.onBrand }]}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Text>
      </Pressable>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  formFields: {
    gap: Spacing.formGap,
  },
  input: {
    height: Sizes.inputHeight,
    borderRadius: Radii.md,
    borderWidth: Borders.thin,
    paddingHorizontal: Spacing.inputPaddingHorizontal,
    paddingVertical: Spacing.inputPaddingVertical,
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.body,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: Spacing.formToForgot,
  },
  forgotPasswordText: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.body,
  },
  button: {
    height: Sizes.buttonHeight,
    borderRadius: Radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.forgotToButton,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.body,
    fontWeight: "700",
  },
  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.buttonToSignup,
  },
  signupText: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.body,
  },
  signupLink: {
    marginLeft: Spacing.signupGap,
  },
  signupLinkText: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.body,
  },
});
