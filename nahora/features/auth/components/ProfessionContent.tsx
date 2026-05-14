import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  Colors,
  Fonts,
  FontSizes,
  LetterSpacing,
  LineHeights,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { ProfessionOption } from "@/store/registerStore";
import { AuthScreenShell } from "./AuthScreenShell";

export const PROFESSION_OPTIONS: ProfessionOption[] = [
  { id: "ELETRICA", label: "Eletricista", icon: "⚡" },
  { id: "ENCANAMENTO", label: "Encanador", icon: "🔧" },
  { id: "PINTURA", label: "Pintor", icon: "🎨" },
  { id: "PEDREIRO", label: "Pedreiro / Reforma", icon: "🏗️" },
  { id: "AR_CONDICIONADO", label: "Ar-Condicionado", icon: "❄️" },
];

type ProfessionContentProps = {
  selected: ProfessionOption | null;
  onSelect: (profession: ProfessionOption) => void;
  onContinue: () => void;
};

export function ProfessionContent({
  selected,
  onSelect,
  onContinue,
}: ProfessionContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const isSelected = (option: ProfessionOption) => selected?.id === option.id;

  return (
    <AuthScreenShell
      title="Qual é a sua profissão?"
      subtitle="Escolha a categoria que melhor descreve o que\nvocê faz."
    >
      <View style={styles.grid}>
        {PROFESSION_OPTIONS.map((option) => {
          const active = isSelected(option);
          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onSelect(option)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: active
                    ? colors.brand + "20"
                    : colors.surface,
                  borderColor: active ? colors.brand : colors.border,
                },
                pressed && styles.cardPressed,
              ]}
            >
              <Text style={styles.cardIcon}>{option.icon}</Text>
              <Text
                style={[
                  styles.cardLabel,
                  { color: active ? colors.brand : colors.textPrimary },
                ]}
              >
                {option.label}
              </Text>
              {active && (
                <View
                  style={[styles.checkBadge, { backgroundColor: colors.brand }]}
                >
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.bottomBar}>
        <Pressable
          accessibilityRole="button"
          disabled={!selected}
          onPress={onContinue}
          style={({ pressed }) => [
            styles.continueButton,
            { backgroundColor: selected ? colors.brand : colors.surface },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text
            style={[
              styles.continueText,
              { color: selected ? colors.onBrand : colors.textSecondary },
            ]}
          >
            Continuar
          </Text>
        </Pressable>
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  card: {
    width: 153,
    minHeight: 98,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    position: "relative",
  },
  cardPressed: {
    opacity: 0.8,
  },
  cardIcon: {
    fontSize: 30,
    lineHeight: 36,
    marginBottom: 8,
  },
  cardLabel: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.body,
    fontWeight: "600",
    textAlign: "center",
  },
  checkBadge: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#eb7a23",
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    color: "#ffffff",
    fontSize: 12,
    lineHeight: 14,
    fontWeight: "700",
  },
  bottomBar: {
    marginTop: 32,
    alignItems: "center",
  },
  continueButton: {
    width: "100%",
    height: 54,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  continueText: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    letterSpacing: -0.24,
    fontWeight: "700",
  },
});
