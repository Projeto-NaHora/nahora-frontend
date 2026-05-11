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

type ValidationRowProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

function ValidationRow({ icon, title, subtitle }: ValidationRowProps) {
  return (
    <View style={styles.statusRow}>
      <View style={styles.statusIconContainer}>{icon}</View>
      <View style={styles.statusTextBlock}>
        <Text style={styles.statusTitle}>{title}</Text>
        <Text style={styles.statusSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

type ValidationContentProps = {
  professionLabel: string;
  onGoToProfile: () => void;
};

export function ValidationContent({
  professionLabel,
  onGoToProfile,
}: ValidationContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <AuthScreenShell
      title="Validando suas\ninformações"
      subtitle="Estamos verificando seus documentos e dados. Isso\npode levar alguns minutos."
    >
      {/* Status list */}
      <View style={styles.statusList}>
        <ValidationRow
          icon={
            <View style={[styles.checkCircle, { backgroundColor: "#e6f7ec" }]}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
          }
          title="Dados pessoais"
          subtitle="Nome, telefone e e-mail verificados"
        />
        <View style={[styles.separator, { borderColor: "#e5e7eb" }]} />
        <ValidationRow
          icon={
            <View style={[styles.checkCircle, { backgroundColor: "#e6f7ec" }]}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
          }
          title="Profissão e áreas"
          subtitle={professionLabel}
        />
        <View style={[styles.separator, { borderColor: "#e5e7eb" }]} />
        <ValidationRow
          icon={
            <View
              style={[styles.pendingCircle, { backgroundColor: "#fdf5df" }]}
            >
              <View style={styles.pendingDots}>
                <View style={[styles.dot, { backgroundColor: "#eb7a23" }]} />
                <View style={[styles.dot, { backgroundColor: "#eb7a23" }]} />
                <View style={[styles.dot, { backgroundColor: "#eb7a23" }]} />
              </View>
            </View>
          }
          title="Documentos (RG)"
          subtitle="Analisando frente, verso e selfie"
        />
        <View style={styles.statusRow}>
          <View style={[styles.pendingCircle, { backgroundColor: "#f3f4f6" }]}>
            <Text style={styles.stepNumber}>4</Text>
          </View>
          <View style={styles.statusTextBlock}>
            <Text style={styles.statusTitle}>Verificação final</Text>
            <Text style={styles.statusSubtitle}>Aguardando etapa anterior</Text>
          </View>
        </View>
      </View>

      {/* Info banner */}
      <View style={[styles.infoBox, { borderColor: "#e5e7eb" }]}>
        <Text style={styles.infoIcon}>📱</Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Você receberá uma notificação quando a verificação for concluída. Crie
          seu perfil profissional enquanto validamos seus documentos
        </Text>
      </View>

      {/* CTA Button */}
      <View style={styles.bottomBar}>
        <Pressable
          accessibilityRole="button"
          onPress={onGoToProfile}
          style={({ pressed }) => [
            styles.profileButton,
            { backgroundColor: "#f3f4f6" },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text
            style={[styles.profileButtonText, { color: colors.textPrimary }]}
          >
            Criar Perfil Profissional
          </Text>
          <Text style={styles.arrowIcon}>→</Text>
        </Pressable>
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  statusList: {
    width: "100%",
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 16,
    alignItems: "flex-start",
  },
  statusIconContainer: {
    width: 32,
    height: 32,
  },
  statusTextBlock: {
    flex: 1,
  },
  statusTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: LetterSpacing.body,
    fontWeight: "700",
    color: "#111827",
  },
  statusSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.body,
    fontWeight: "400",
    color: "#6b7280",
  },
  separator: {
    borderTopWidth: 1,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    fontSize: 14,
    lineHeight: 16,
    color: "#24994f",
    fontWeight: "700",
  },
  pendingCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pendingDots: {
    flexDirection: "row",
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  stepNumber: {
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    fontWeight: "600",
    color: "#6b7280",
  },
  infoBox: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    marginBottom: 32,
    alignItems: "flex-start",
  },
  infoIcon: {
    fontSize: 18,
    lineHeight: 20,
  },
  infoText: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: 22.75,
    letterSpacing: LetterSpacing.body,
    fontWeight: "400",
  },
  bottomBar: {
    alignItems: "center",
  },
  profileButton: {
    width: "100%",
    height: 56,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  profileButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: 24,
    letterSpacing: LetterSpacing.body,
    fontWeight: "600",
  },
  arrowIcon: {
    fontSize: 18,
    lineHeight: 20,
    color: "#111827",
  },
});
