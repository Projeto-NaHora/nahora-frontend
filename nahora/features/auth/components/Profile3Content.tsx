import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { ServerErrorBanner } from "@/components/ui/server-error-banner";
import { ProfileStepIndicator } from "./ProfileStepIndicator";

type Profile3ContentProps = {
  portfolioPhotos: string[];
  onPickPhoto: () => void;
  onRemovePhoto: (index: number) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  error?: string | null;
  /** Código HTTP do erro (ex.: 401) para exibir como badge no banner */
  errorStatus?: number | null;
};

export function Profile3Content({
  portfolioPhotos,
  onPickPhoto,
  onRemovePhoto,
  onBack,
  onSubmit,
  isSubmitting,
  error,
  errorStatus,
}: Profile3ContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: "#ffffff" }]}>
      {/* Step Indicator */}
      <ProfileStepIndicator currentStep={3} />

      {/* Heading */}
      <Text style={[styles.heading, { color: colors.textPrimary }]}>
        Seu Portfólio
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Envie fotos do seu trabalho para construir confiança com clientes em
        potencial.
      </Text>

      {/* Error Banner */}
      {error ? (
        <ServerErrorBanner
          title="Erro ao concluir cadastro"
          message={error}
          statusCode={errorStatus ?? undefined}
          style={{ marginBottom: 16 }}
        />
      ) : null}

      {/* Upload Zone */}
      <Pressable
        accessibilityRole="button"
        onPress={onPickPhoto}
        style={({ pressed }) => [
          styles.uploadZone,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
          pressed && styles.buttonPressed,
        ]}
      >
        <View style={styles.uploadIconContainer}>
          <View
            style={[styles.uploadIconBg, { backgroundColor: colors.surface }]}
          >
            <Text style={styles.uploadIcon}>📁</Text>
          </View>
        </View>
        <Text style={[styles.uploadTitle, { color: colors.textPrimary }]}>
          Toque para enviar fotos
        </Text>
        <Text style={[styles.uploadHint, { color: colors.textSecondary }]}>
          PNG, JPG até 10MB
        </Text>
      </Pressable>

      {/* Photos Grid */}
      {portfolioPhotos.length > 0 && (
        <View style={styles.photosSection}>
          <Text style={[styles.photosTitle, { color: colors.textPrimary }]}>
            Fotos Enviadas ({portfolioPhotos.length})
          </Text>
          <View style={styles.photosGrid}>
            {portfolioPhotos.map((uri, index) => (
              <View
                key={`${uri}-${index}`}
                style={[styles.photoItem, { borderColor: colors.border }]}
              >
                <Image source={{ uri }} style={styles.photoImage} />
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onRemovePhoto(index)}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [
            styles.outlineButton,
            { borderColor: colors.border },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text
            style={[styles.outlineButtonText, { color: colors.textPrimary }]}
          >
            Voltar
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={onSubmit}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: colors.brand },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.primaryButtonText, { color: colors.onBrand }]}>
            {isSubmitting ? "Enviando..." : "Concluir Perfil"}
          </Text>
          <Text style={[styles.checkIcon, { color: colors.onBrand }]}>✓</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    marginBottom: 24,
  },
  uploadZone: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 24,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8,
    marginBottom: 32,
  },
  uploadIconContainer: {
    marginBottom: 12,
  },
  uploadIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadIcon: {
    fontSize: 24,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 4,
  },
  uploadHint: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  photosSection: {
    marginBottom: 24,
  },
  photosTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  photoItem: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    position: "relative",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    fontSize: 14,
  },
  bottomBar: {
    flexDirection: "row",
    gap: 16,
    marginTop: "auto",
    marginBottom: 24,
  },
  outlineButton: {
    flex: 1,
    height: 54,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  primaryButton: {
    flex: 1,
    height: 54,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  buttonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  checkIcon: {
    fontSize: 20,
    fontWeight: "700",
  },
});
