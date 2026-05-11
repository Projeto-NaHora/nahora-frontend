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
import { AuthScreenShell } from "./AuthScreenShell";

type DocBoxProps = {
  icon: string;
  label: string;
  uri: string | null;
  onPress: () => void;
};

function DocBox({ icon, label, uri, onPress }: DocBoxProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.docBox,
        { backgroundColor: uri ? "#e6f7ec" : "#f9fafb" },
        pressed && styles.docBoxPressed,
      ]}
    >
      <Text style={styles.docBoxIcon}>{icon}</Text>
      <Text style={[styles.docBoxLabel, { color: colors.textSecondary }]}>
        {uri ? "Enviado" : label}
      </Text>
    </Pressable>
  );
}

type DocsContentProps = {
  rgFrontUri: string | null;
  rgBackUri: string | null;
  selfieUri: string | null;
  onPickRgFront: () => void;
  onPickRgBack: () => void;
  onPickSelfie: () => void;
  onContinue: () => void;
  isUploading?: boolean;
};

export function DocsContent({
  rgFrontUri,
  rgBackUri,
  selfieUri,
  onPickRgFront,
  onPickRgBack,
  onPickSelfie,
  onContinue,
  isUploading = false,
}: DocsContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const allUploaded = rgFrontUri && rgBackUri && selfieUri;

  return (
    <AuthScreenShell
      title="Envie seus\ndocumentos"
      subtitle="Para validar seu perfil precisamos do seu RG e uma\nselfie segurando o documento."
    >
      {/* Privacy notice */}
      <View style={[styles.privacyBox, { borderColor: "#8ab4f8" }]}>
        <Text style={styles.privacyIcon}>🔒</Text>
        <Text style={styles.privacyText}>
          Seus dados são criptografados e usados apenas para verificação de
          identidade. Não compartilhamos com terceiros.
        </Text>
      </View>

      {/* RG Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          RG — Frente e Verso
        </Text>
        <View style={styles.docRow}>
          <DocBox
            icon="📄"
            label="Toque para enviar"
            uri={rgFrontUri}
            onPress={onPickRgFront}
          />
          <DocBox
            icon="📄"
            label="Toque para enviar"
            uri={rgBackUri}
            onPress={onPickRgBack}
          />
        </View>
        <View style={styles.hintRow}>
          <Text style={styles.hintEmoji}>📸</Text>
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            Foto nítida, sem reflexos. Aceito: JPG, PNG ou PDF.
          </Text>
        </View>
      </View>

      {/* Selfie Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Selfie segurando o RG
        </Text>
        <View style={styles.selfieBoxWrapper}>
          <Pressable
            accessibilityRole="button"
            onPress={onPickSelfie}
            style={({ pressed }) => [
              styles.selfieBox,
              { backgroundColor: selfieUri ? "#e6f7ec" : "#f9fafb" },
              pressed && styles.docBoxPressed,
            ]}
          >
            <Text style={styles.selfieIcon}>🤳</Text>
            <Text style={[styles.selfieLabel, { color: colors.textSecondary }]}>
              Tire uma foto segurando o RG ao lado do rosto
            </Text>
          </Pressable>
        </View>
        <View style={styles.hintRow}>
          <Text style={styles.hintEmoji}>💡</Text>
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            Dica: Boa iluminação no rosto, documento legível. O documento deve
            aparecer inteiro na foto.
          </Text>
        </View>
      </View>

      {/* Continue button */}
      <View style={styles.bottomBar}>
        <Pressable
          accessibilityRole="button"
          disabled={!allUploaded || isUploading}
          onPress={onContinue}
          style={({ pressed }) => [
            styles.continueButton,
            {
              backgroundColor:
                allUploaded && !isUploading ? colors.brand : "#e5e7eb",
            },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text
            style={[
              styles.continueText,
              {
                color: allUploaded && !isUploading ? colors.onBrand : "#9ca3af",
              },
            ]}
          >
            {isUploading ? "Enviando..." : "Continuar"}
          </Text>
        </Pressable>
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  privacyBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#e5effa",
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    marginBottom: 32,
    alignItems: "flex-start",
  },
  privacyIcon: {
    fontSize: 20,
    lineHeight: 22,
  },
  privacyText: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: 22.75,
    letterSpacing: LetterSpacing.body,
    fontWeight: "500",
    color: "#1a56db",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.body,
    fontWeight: "700",
    marginBottom: 12,
  },
  docRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
  },
  docBox: {
    flex: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 25,
    paddingHorizontal: 24,
  },
  docBoxPressed: {
    opacity: 0.8,
  },
  docBoxIcon: {
    fontSize: 32,
    lineHeight: 32,
    marginBottom: 12,
  },
  docBoxLabel: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.body,
    fontWeight: "600",
    textAlign: "center",
  },
  hintRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "flex-start",
  },
  hintEmoji: {
    fontSize: 12,
    lineHeight: 16,
  },
  hintText: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: LetterSpacing.body,
  },
  selfieBoxWrapper: {
    marginBottom: 10,
  },
  selfieBox: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  selfieIcon: {
    fontSize: 36,
    lineHeight: 40,
    marginBottom: 12,
  },
  selfieLabel: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.body,
    fontWeight: "600",
    textAlign: "center",
  },
  bottomBar: {
    marginTop: 16,
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
