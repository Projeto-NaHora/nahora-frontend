import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
import { ServerErrorBanner } from "@/components/ui/server-error-banner";
import { AuthScreenShell } from "./AuthScreenShell";
import type { RegisterPasswordFormValues } from "../types";

type PasswordContentProps = {
  control: Control<RegisterPasswordFormValues>;
  isSubmitting: boolean;
  onSubmit: () => void;
  error?: string | null;
  /** Código HTTP do erro (ex.: 401) para exibir como badge no banner */
  errorStatus?: number | null;
};

export function PasswordContent({
  control,
  isSubmitting,
  onSubmit,
  error,
  errorStatus,
}: PasswordContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <AuthScreenShell
      title={"Quase lá!\nDefina sua senha"}
      subtitle={
        "Tome cuidado para não esquecer sua senha e nem compartilhá-la com ninguém"
      }
    >
      <View style={styles.formStack}>
        {error && (
          <ServerErrorBanner
            title="Erro ao cadastrar"
            message={error}
            statusCode={errorStatus ?? undefined}
          />
        )}
        <View style={styles.formFields}>
          <Controller
            control={control}
            name="password"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View>
                <PasswordInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: error ? colors.error : colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  placeholder="Digite sua senha"
                  placeholderTextColor={colors.placeholder}
                  textContentType="newPassword"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {error && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View>
                <PasswordInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: error ? colors.error : colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  placeholder="Confirmar senha"
                  placeholderTextColor={colors.placeholder}
                  textContentType="newPassword"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {error && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
        <Pressable
          accessibilityRole="button"
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
            Confirmar
          </Text>
        </Pressable>
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  formStack: {
    gap: Spacing.formGap,
  },
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
  errorText: {
    fontSize: FontSizes.caption,
    lineHeight: LineHeights.body,
    marginTop: 4,
    fontFamily: Fonts?.sans,
  },
  button: {
    height: Sizes.buttonHeight,
    borderRadius: Radii.pill,
    alignItems: "center",
    justifyContent: "center",
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
});
