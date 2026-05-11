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
import { formatPhone } from "@/utils/formatters";
import { AuthScreenShell } from "./AuthScreenShell";
import type { RegisterPhoneFormValues } from "../types";

type PhoneContentProps = {
  control: Control<RegisterPhoneFormValues>;
  isSubmitting: boolean;
  onSubmit: () => void;
};

export function PhoneContent({
  control,
  isSubmitting,
  onSubmit,
}: PhoneContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <AuthScreenShell
      title="Qual o seu número?"
      subtitle={"Enviaremos um código de verificação para este\nnúmero."}
    >
      <View style={styles.formStack}>
        <Controller
          control={control}
          name="phone"
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
                placeholder="(11) 99999-9999"
                placeholderTextColor={colors.placeholder}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={(text) => onChange(formatPhone(text))}
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
