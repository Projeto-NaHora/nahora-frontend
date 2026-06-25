import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import useSWR from "swr";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Fonts } from "@/constants/theme";
import { getApiErrorMessage } from "@/utils/apiError";
import { profileService } from "@/features/profile/service";
import { useThemeStore, ThemeMode } from "@/store/themeStore";
import { useBiometria } from "@/hooks/useBiometria";
import type { PreferenciasNotificacao } from "@/features/profile/types";

export default function Screen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);
  const { isAvailable: biometryAvailable, isEnabled: biometryEnabled, isChecking: biometryChecking, setEnabled: setBiometryEnabled } = useBiometria();

  const {
    data: prefs,
    isLoading,
    error,
    mutate,
  } = useSWR<PreferenciasNotificacao>("preferencias", () =>
    profileService.buscarPreferencias(),
  );

  const togglePref = async (key: keyof PreferenciasNotificacao, value: boolean) => {
    if (!prefs) return;
    try {
      await profileService.atualizarPreferencias({ [key]: value });
      mutate();
    } catch {
      // silently ignore
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (error) {
    const mensagem = getApiErrorMessage(error, "Erro ao carregar.");
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          Erro ao carregar configurações
        </Text>
        <Text style={[styles.errorDetail, { color: colors.textSecondary }]}>
          {mensagem}
        </Text>
        <Pressable
          onPress={() => mutate()}
          style={({ pressed }) => [
            styles.retryButton,
            { backgroundColor: colors.brand },
            pressed && styles.retryButtonPressed,
          ]}
        >
          <Text style={[styles.retryButtonText, { color: colors.onBrand }]}>
            Tentar novamente
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: "rgba(244,244,245,0.6)" },
            pressed && styles.backButtonPressed,
          ]}
        >
          <IconSymbol name="chevron.left" size={20} color="#1c1c1e" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Configurações
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Aparência */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>APARÊNCIA</Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.background,
                borderColor: "#eaeaea",
              },
            ]}
          >
            <ThemeRow
              icon="sun.max.fill"
              title="Claro"
              subtitle="Tema claro permanente"
              selected={themeMode === "light"}
              onPress={() => setThemeMode("light")}
              colors={colors}
              isLast={false}
            />
            <ThemeRow
              icon="moon.fill"
              title="Escuro"
              subtitle="Tema escuro permanente"
              selected={themeMode === "dark"}
              onPress={() => setThemeMode("dark")}
              colors={colors}
              isLast={false}
            />
            <ThemeRow
              icon="gearshape.fill"
              title="Sistema"
              subtitle="Acompanha o tema do dispositivo"
              selected={themeMode === "system"}
              onPress={() => setThemeMode("system")}
              colors={colors}
              isLast
            />
          </View>
        </View>

        {/* Notificações */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NOTIFICAÇÕES DE PREFERÊNCIAS</Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.background,
                borderColor: "#eaeaea",
              },
            ]}
          >
            <NotificationRow
              icon="bell.fill"
              title="Notificações de Push"
              subtitle="Alertas sobre seus serviços"
              value={prefs?.notificacoesPush ?? false}
              onToggle={(v) => togglePref("notificacoesPush", v)}
              colors={colors}
              isLast={false}
            />
            <NotificationRow
              icon="envelope.fill"
              title="Notificações por Email"
              subtitle="Promoções e ofertas especiais"
              value={prefs?.emailsPromocionais ?? false}
              onToggle={(v) => togglePref("emailsPromocionais", v)}
              colors={colors}
              isLast={false}
            />
            <NotificationRow
              icon="bubble.left.and.bubble.right.fill"
              title="Notificações por WhatsApp"
              subtitle="Contato direto com clientes"
              value={prefs?.mensagensWhatsapp ?? false}
              onToggle={(v) => togglePref("mensagensWhatsapp", v)}
              colors={colors}
              isLast
            />
          </View>
        </View>

        {/* Segurança */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SEGURANÇA</Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.background,
                borderColor: "#eaeaea",
              },
            ]}
          >
            <Pressable
              onPress={() =>
                router.push("/(professional)/(account)/settings/password")
              }
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: "#f8f9fa" }]}>
                <IconSymbol name="lock" size={18} color="#8c8c8c" />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                  Alterar Senha
                </Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  Atualize sua senha de acesso
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#c4c4c4" />
            </Pressable>

            <View style={[styles.divider, { backgroundColor: "#eaeaea" }]} />

            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: "#f8f9fa" }]}>
                <IconSymbol name="person.fill" size={18} color="#8c8c8c" />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                  Autenticação Biométrica
                </Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  {biometryAvailable ? "Use Face ID / Touch ID para logar" : "Não disponível neste dispositivo"}
                </Text>
              </View>
              <Switch
                value={biometryEnabled}
                onValueChange={setBiometryEnabled}
                disabled={!biometryAvailable || biometryChecking}
                trackColor={{ false: "#d1d5db", true: "#e67215" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ThemeRow({
  icon,
  title,
  subtitle,
  selected,
  onPress,
  colors,
  isLast,
}: {
  icon: string;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
  colors: any;
  isLast: boolean;
}) {
  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      >
        <View style={[styles.iconCircle, { backgroundColor: "#f8f9fa" }]}>
          <IconSymbol name={icon as any} size={18} color="#8c8c8c" />
        </View>
        <View style={styles.rowContent}>
          <Text style={[styles.rowTitle, { color: selected ? colors.brand : colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
        {selected ? (
          <IconSymbol name="checkmark" size={20} color={colors.brand} />
        ) : (
          <View style={{ width: 20 }} />
        )}
      </Pressable>
      {!isLast && (
        <View style={[styles.divider, { backgroundColor: "#eaeaea" }]} />
      )}
    </>
  );
}

function NotificationRow({
  icon,
  title,
  subtitle,
  value,
  onToggle,
  colors,
  isLast,
}: {
  icon: string;
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  colors: any;
  isLast: boolean;
}) {
  return (
    <>
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: "#f8f9fa" }]}>
          <IconSymbol name={icon as any} size={18} color="#8c8c8c" />
        </View>
        <View style={styles.rowContent}>
          <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#d1d5db", true: "#e67215" }}
          thumbColor="#ffffff"
        />
      </View>
      {!isLast && (
        <View style={[styles.divider, { backgroundColor: "#eaeaea" }]} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  errorIcon: { fontSize: 48, marginBottom: 8 },
  errorText: {
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
    textAlign: "center",
  },
  errorDetail: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  retryButtonPressed: { opacity: 0.85 },
  retryButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonPressed: { opacity: 0.7 },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 27,
    textAlign: "center",
  },
  headerSpacer: { width: 44 },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 28, paddingBottom: 40 },

  section: { gap: 12 },
  sectionLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    color: "#8c8c8c",
    letterSpacing: 0.7,
    paddingLeft: 8,
  },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    boxShadow: "0 2px 12px rgba(0,0,0,0.01)",
    paddingVertical: 4,
    paddingHorizontal: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 18,
  },
  rowPressed: { opacity: 0.6 },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: { flex: 1, gap: 2 },
  rowTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 18.75,
  },
  rowSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 16.25,
  },

  divider: { height: 1 },
});
