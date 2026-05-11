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
import { AuthScreenShell } from "./AuthScreenShell";
import type { RegisterEmailFormValues } from "../types";

type EmailContentProps = {
  control: Control<RegisterEmailFormValues>;
  isSubmitting: boolean;
  onSubmit: () => void;
};

export function EmailContent({
  control,
  isSubmitting,
  onSubmit,
}: EmailContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <AuthScreenShell
      title="Qual o seu e-mail?"
    >
      <View style={styles.formStack}>
        <Controller
          control={control}
          name="email"
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
                placeholder="email@exemplo.com"
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
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
            Enviar
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
