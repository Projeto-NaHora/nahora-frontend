import React, { useState } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

const MASK_CHAR = "●";
const DEFAULT_ICON_COLOR = "#8E8E93";

export type PasswordInputProps = Omit<TextInputProps, "secureTextEntry"> & {
  value?: string;
  onChangeText?: (text: string) => void;
  /** Color for the visibility toggle icon. Defaults to a neutral gray. */
  iconColor?: string;
};

/**
 * A password `TextInput` that masks characters manually using `●` instead of
 * relying on React Native's native `secureTextEntry`.
 *
 * This completely avoids the Android flicker where each typed character briefly
 * appears as plain text before turning into a dot.
 *
 * Includes a visibility toggle (eye icon) that lets the user see the typed
 * password as plain text.
 *
 * Trade-off: insertion / replacement in the *middle* of the field is ignored
 * (the cursor is invisible since all chars look identical), which matches the
 * UX of real password fields where users always type at the end.
 */
export function PasswordInput({
  value,
  onChangeText,
  style,
  iconColor = DEFAULT_ICON_COLOR,
  ...props
}: PasswordInputProps) {
  const realValue = value ?? "";
  const [showPassword, setShowPassword] = useState(false);


  const displayValue = showPassword
    ? realValue
    : MASK_CHAR.repeat(realValue.length);

  const handleChangeText = (text: string) => {
      const oldLen = realValue.length;

      if (text.length < oldLen) {
        // Backspace / selection-delete → trim from end
        const newValue = realValue.slice(0, text.length);
        onChangeText?.(newValue);
      } else if (text.length > oldLen) {
        // Typing or pasting at the end → append new characters
        const added = text.slice(oldLen);
        const newValue = realValue + added;
        onChangeText?.(newValue);
      }
      // Same length  → in-place edit, safely ignored
    };

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <View style={{ position: "relative" }}>
      <TextInput
        value={displayValue}
        onChangeText={handleChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="visible-password"
        autoComplete="off"
        textContentType="none"
        spellCheck={false}
        style={[{ paddingRight: 44 }, style]}
        {...props}
      />
      <Pressable
        onPress={toggleVisibility}
        hitSlop={8}
        accessibilityLabel={
          showPassword ? "Ocultar senha" : "Mostrar senha"
        }
        accessibilityRole="button"
        style={{
          position: "absolute",
          right: 12,
          top: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        }}
      >
        <IconSymbol
          name={showPassword ? "eye.fill" : "eye.slash.fill"}
          size={22}
          color={iconColor}
        />
      </Pressable>
    </View>
  );
}
