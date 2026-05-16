import React, { useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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

type OtpContentProps = {
  onSubmit: () => void;
  phoneLabel?: string;
  code: string;
  onChangeCode: (code: string) => void;
  error?: string;
  isSubmitting: boolean;
  /** Código HTTP do erro (ex.: 401) para exibir como badge no banner */
  errorStatus?: number | null;
};

export function OtpContent({
  onSubmit,
  phoneLabel,
  code,
  onChangeCode,
  error,
  isSubmitting,
  errorStatus,
}: OtpContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const subtitle = phoneLabel
    ? `Enviamos um código de 6 dígitos para\n${phoneLabel}`
    : "Enviamos um código de 6 dígitos para\n+55 81 1234-5678";

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/\D/g, "");

    if (digit) {
      // User typed a digit — fill position and advance
      const newCode = code.slice(0, index) + digit + code.slice(index + 1);
      onChangeCode(newCode.slice(0, 6));
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (text === "" && code[index]) {
      // Backspace on filled input — clear and go back
      const newCode = code.slice(0, index) + code.slice(index + 1);
      onChangeCode(newCode);
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      // Backspace on empty input — just go back
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <AuthScreenShell title="Verifique seu número" subtitle={subtitle}>
      <View style={styles.formStack}>
        <View style={styles.otpRow}>
          {Array.from({ length: 6 }).map((_, index) => (
            <TextInput
              key={`otp-${index}`}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: error ? colors.error : colors.border,
                  color: colors.textPrimary,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              textContentType={index === 0 ? "oneTimeCode" : "none"}
              autoCorrect={false}
              aria-label={`OTP digit ${index + 1}`}
              value={code[index] || ""}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
            />
          ))}
        </View>
        {error && (
          <ServerErrorBanner
            title="Erro ao verificar código"
            message={error}
            statusCode={errorStatus ?? undefined}
          />
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
            {isSubmitting ? "Verificando..." : "Verificar Código"}
          </Text>
        </Pressable>
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  formStack: {
    gap: Spacing.otpToButton,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: Sizes.formWidth,
  },
  otpInput: {
    width: Sizes.otpBoxWidth,
    height: Sizes.otpBoxHeight,
    borderRadius: Radii.lg,
    borderWidth: Borders.thin,
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.body,
    textAlign: "center",
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
