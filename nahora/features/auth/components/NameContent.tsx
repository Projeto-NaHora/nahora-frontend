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
import { ServerErrorBanner } from "@/components/ui/server-error-banner";
import { AuthScreenShell } from "./AuthScreenShell";
import type { RegisterNameFormValues } from "../types";

type NameContentProps = {
  control: Control<RegisterNameFormValues>;
  isSubmitting: boolean;
  onSubmit: () => void;
  error?: string | null;
  errorStatus?: number | null;
};

export function NameContent({
  control,
  isSubmitting,
  onSubmit,
  error,
  errorStatus,
}: NameContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <AuthScreenShell
      title="Qual seu nome?"
      subtitle="Defina seu nome para começar a usar o NaHora!"
    >
      <View style={styles.formStack}>
        <View style={styles.formFields}>
          <Controller
            control={control}
            name="firstName"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: error ? colors.error : colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  placeholder="Nome"
                  placeholderTextColor={colors.placeholder}
                  textContentType="givenName"
                  autoCapitalize="words"
                  autoCorrect={false}
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
            name="lastName"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: error ? colors.error : colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  placeholder="Sobrenome"
                  placeholderTextColor={colors.placeholder}
                  textContentType="familyName"
                  autoCapitalize="words"
                  autoCorrect={false}
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
        {error && (
          <ServerErrorBanner message={error} statusCode={errorStatus ?? undefined} />
        )}
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
    borderRadius: Radii.md,
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
