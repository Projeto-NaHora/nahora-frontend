import React, { useEffect, useState } from "react";
import { TextInput, type TextInputProps } from "react-native";

const MASK_CHAR = "●";

export type PasswordInputProps = Omit<TextInputProps, "secureTextEntry"> & {
  value?: string;
  onChangeText?: (text: string) => void;
};

/**
 * A password `TextInput` that masks characters manually using `●` instead of
 * relying on React Native's native `secureTextEntry`.
 *
 * This completely avoids the Android flicker where each typed character briefly
 * appears as plain text before turning into a dot.
 *
 * Trade-off: insertion / replacement in the *middle* of the field is ignored
 * (the cursor is invisible since all chars look identical), which matches the
 * UX of real password fields where users always type at the end.
 */
export function PasswordInput({
  value,
  onChangeText,
  ...props
}: PasswordInputProps) {
  const [realValue, setRealValue] = useState(value ?? "");

  // Sync from external (e.g. form.reset(), initial value)
  useEffect(() => {
    setRealValue(value ?? "");
  }, [value]);

  const displayValue = MASK_CHAR.repeat(realValue.length);

  const handleChangeText = (text: string) => {
    const oldLen = realValue.length;

    if (text.length < oldLen) {
      // Backspace / selection-delete → trim from end
      const newValue = realValue.slice(0, text.length);
      setRealValue(newValue);
      onChangeText?.(newValue);
    } else if (text.length > oldLen) {
      // Typing or pasting at the end → append new characters
      const added = text.slice(oldLen);
      const newValue = realValue + added;
      setRealValue(newValue);
      onChangeText?.(newValue);
    }
    // Same length  → in-place edit, safely ignored
  };

  return (
    <TextInput
      value={displayValue}
      onChangeText={handleChangeText}
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
    />
  );
}
