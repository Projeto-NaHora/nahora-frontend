import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Colors } from "@/constants/theme";

import { ProfileStepIndicator } from "./ProfileStepIndicator";

type Profile2ContentProps = {
  about: string;
  especialidades: string[];
  onChangeAbout: (value: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function Profile2Content({
  about,
  especialidades,
  onChangeAbout,
  onAddTag,
  onRemoveTag,
  onBack,
  onContinue,
}: Profile2ContentProps) {
  const theme = "light";
  const colors = Colors[theme];

  const [tagInput, setTagInput] = useState("");

  const handleSubmitTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed.length > 0) {
      onAddTag(trimmed);
      setTagInput("");
    }
  };

  const isAboutValid = about.trim().length >= 10;
  const hasEspecialidades = especialidades.length >= 1;
  const isValid = isAboutValid && hasEspecialidades;

  return (
    <View style={[styles.container, { backgroundColor: "#ffffff" }]}>
      {/* Step Indicator */}
      <ProfileStepIndicator currentStep={2} />

      {/* Heading */}
      <Text style={[styles.heading, { color: colors.textPrimary }]}>
        Suas Especialidades
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Detalhe os serviços que você oferece e sua experiência.
      </Text>

      {/* Form Fields */}
      <View style={styles.form}>
        {/* Sobre Você */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Sobre Você
          </Text>
          <View
            style={[
              styles.textAreaWrapper,
              {
                borderColor: colors.border,
                backgroundColor: colors.surface,
              },
            ]}
          >
            <TextInput
              style={[styles.textArea, { color: colors.textPrimary }]}
              placeholder="Descreva brevemente sua experiência, certificações e o que faz seu serviço se destacar..."
              placeholderTextColor={colors.placeholder}
              value={about}
              onChangeText={onChangeAbout}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Adicionar Especialidades (Tags) */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Adicionar Especialidades (Tags)
          </Text>
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputIconContainer,
                { borderColor: colors.textSecondary },
              ]}
            >
              <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>
                +
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Digite um serviço e pressione enter"
              placeholderTextColor={colors.placeholder}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleSubmitTag}
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Tags */}
        {especialidades.length > 0 && (
          <View style={styles.tagsContainer}>
            {especialidades.map((tag, index) => (
              <View key={`${tag}-${index}`} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onRemoveTag(index)}
                  hitSlop={8}
                >
                  <Text style={styles.tagRemove}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>

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
          disabled={!isValid}
          onPress={onContinue}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: isValid ? colors.brand : colors.surface,
            },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { color: isValid ? colors.onBrand : colors.textSecondary },
            ]}
          >
            Próximo Passo
          </Text>
          <Text
            style={[
              styles.arrowIcon,
              { color: isValid ? colors.onBrand : colors.textSecondary },
            ]}
          >
            →
          </Text>
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
  form: {
    gap: 24,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  textArea: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    minHeight: 120,
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  inputIconContainer: {
    position: "absolute",
    left: 14,
    zIndex: 1,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  inputIcon: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 16,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 44,
    paddingRight: 14,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7ed",
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ea580c",
  },
  tagRemove: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ea580c",
    opacity: 0.7,
  },
  bottomBar: {
    flexDirection: "row",
    gap: 16,
    marginTop: 32,
    marginBottom: 24,
  },
  outlineButton: {
    flex: 1,
    height: 54,
    borderRadius: 24,
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
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 24,
    textAlign: "center",
  },
  arrowIcon: {
    fontSize: 18,
    fontWeight: "500",
  },
});
