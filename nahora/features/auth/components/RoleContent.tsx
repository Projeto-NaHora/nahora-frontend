import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
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

type RoleContentProps = {
  onSelectProfessional: () => void;
  onSelectClient: () => void;
};

export function RoleContent({
  onSelectProfessional,
  onSelectClient,
}: RoleContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <AuthScreenShell
      title="Escolha seu perfil"
      subtitle="Como você pretende atuar no NaHora!?"
    >
      <View style={styles.buttonStack}>
        <Pressable
          accessibilityRole="button"
          onPress={onSelectProfessional}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.brand },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.onBrand }]}>
            Profissional
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onSelectClient}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.brand },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.onBrand }]}>
            Cliente
          </Text>
        </Pressable>
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  buttonStack: {
    gap: Spacing.formGap,
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
  buttonText: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.body,
    fontWeight: "700",
  },
});
