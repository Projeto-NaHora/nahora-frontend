import React from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Colors } from "@/constants/theme";

export type SearchInputProps = TextInputProps & {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  style?: any;
};

/**
 * Search input used on the "Todas as categorias" screen.
 * Visuals inspired by the Figma frame:
 * - Rounded 16px, height 56
 * - Light-gray background, subtle border and inner search icon
 *
 * Tailwind suggestion (visual reference):
 * "bg-gray-100 rounded-lg border border-gray-200 h-14 px-4 flex-row items-center"
 */
export function SearchInput({
  value,
  onChangeText,
  placeholder = "Buscar por nome ou categoria...",
  style,
  ...rest
}: SearchInputProps) {
  const bg = useThemeColor({ light: "#f4f4f5" }, "surface");
  const borderColor = useThemeColor({ light: "#f0f0f0" }, "border");
  const placeholderColor = useThemeColor({}, "placeholder");
  const textColor = useThemeColor({}, "text");

  return (
    <View
      style={[styles.container, { backgroundColor: bg, borderColor }, style]}
    >
      <MaterialIcons
        name="search"
        size={20}
        color={placeholderColor}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        style={[styles.input, { color: textColor }]}
        accessible
        accessibilityLabel={placeholder}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
});

export default SearchInput;
