// app/(client)/(account)/settings/index.tsx
//
// F07 — Configurações
// Design reference: Figma node 325:1102
// Sections:
//   1. NOTIFICAÇÕES DE PREFERÊNCIAS (3 toggles, auto-save via PATCH)
//   2. MODO DE EXIBIÇÃO (segmented control — Claro / Escuro / Sistema)
//   3. SEGURANÇA (Alterar Senha + Autenticação Biométrica)

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

import { useSettingsPreferences } from "@/features/settings/hooks/useSettingsPreferences";
import { useSettingsDisplay } from "@/features/settings/hooks/useSettingsDisplay";
import { useSettingsBiometry } from "@/features/settings/hooks/useSettingsBiometry";
import { Snackbar } from "@/components/ui/Snackbar";
import type { DisplayMode } from "@/features/settings/types";

// ---------------------------------------------------------------------------
// Design tokens (from Figma 325:1102)
// ---------------------------------------------------------------------------
const Tokens = {
  bg: "#ffffff",
  sectionTitle: "#8c8c8c",
  titleText: "#111111",
  subtitleText: "#8c8c8c",
  cardBg: "#ffffff",
  cardBorder: "#eaeaea",
  cardRadius: 20,
  iconBg: "#f8f9fa",
  iconColor: "#8c8c8c",
  toggleOn: "#e67215",
  toggleOff: "#eaeaea",
  toggleThumb: "#ffffff",
  segBg: "#f8f9fa",
  segRadius: 16,
  segItemRadius: 12,
  segSelectedBg: "#ffffff",
  segSelectedBorder: "#eaeaea",
  segSelectedText: "#111111",
  segUnselectedText: "#8c8c8c",
  chevronColor: "#c4c4c4",
  backBtnBg: "rgba(244,244,245,0.6)",
  headingColor: "#1c1c1e",
  rowBorder: "#eaeaea",
} as const;

// ---------------------------------------------------------------------------
// Simple SVG-as-View icons matching the Figma design
// ---------------------------------------------------------------------------

function IconCircle({
  children,
  size = 32,
  bg = Tokens.iconBg,
}: {
  children: React.ReactNode;
  size?: number;
  bg?: string;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
}

/** Bell icon — simplified as a View-based shape */
function IconBell({
  color = Tokens.iconColor,
  size = 18,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size * 0.7,
          height: size * 0.8,
          borderRadius: size * 0.2,
          borderWidth: 1.5,
          borderColor: color,
          backgroundColor: "transparent",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: size * 0.55,
            height: size * 0.55,
            borderRadius: size * 0.15,
            borderWidth: 1.5,
            borderColor: color,
            marginTop: 2,
          }}
        />
      </View>
      <View
        style={{
          width: size * 0.3,
          height: size * 0.15,
          backgroundColor: color,
          borderRadius: 1,
          marginTop: -2,
        }}
      />
    </View>
  );
}

/** WhatsApp icon — simplified speech bubble */
function IconWhatsApp({
  color = Tokens.iconColor,
  size = 18,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size * 0.8,
          height: size * 0.65,
          borderRadius: size * 0.3,
          borderWidth: 1.5,
          borderColor: color,
          backgroundColor: "transparent",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: size * 0.05,
          left: size * 0.05,
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.12,
          borderRightWidth: 0,
          borderTopWidth: size * 0.2,
          borderStyle: "solid",
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: color,
        }}
      />
    </View>
  );
}

/** Mail icon — simplified envelope */
function IconMail({
  color = Tokens.iconColor,
  size = 18,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size * 0.85,
          height: size * 0.6,
          borderRadius: 3,
          borderWidth: 1.5,
          borderColor: color,
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: size * 0.5,
            height: 1.5,
            backgroundColor: color,
            marginTop: -2,
          }}
        />
      </View>
    </View>
  );
}

/** Sun icon for "Claro" — circle with rays */
function IconSun({
  color = Tokens.iconColor,
  size = 20,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size * 0.45,
          height: size * 0.45,
          borderRadius: (size * 0.45) / 2,
          borderWidth: 1.7,
          borderColor: color,
          backgroundColor: "transparent",
        }}
      />
    </View>
  );
}

/** Moon icon for "Escuro" */
function IconMoon({
  color = Tokens.iconColor,
  size = 20,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size * 0.65,
          height: size * 0.65,
          borderRadius: (size * 0.65) / 2,
          borderWidth: 1.7,
          borderColor: color,
          backgroundColor: "transparent",
          overflow: "hidden",
        }}
      />
    </View>
  );
}

/** Phone icon for "Sistema" */
function IconPhone({
  color = Tokens.iconColor,
  size = 20,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size * 0.45,
          height: size * 0.7,
          borderRadius: size * 0.15,
          borderWidth: 1.7,
          borderColor: color,
          backgroundColor: "transparent",
        }}
      />
    </View>
  );
}

/** Lock icon */
function IconLock({
  color = Tokens.iconColor,
  size = 18,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size * 0.55,
          height: size * 0.35,
          borderRadius: 3,
          borderWidth: 1.5,
          borderColor: color,
          marginTop: size * 0.3,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          width: size * 0.4,
          height: size * 0.5,
          borderTopLeftRadius: size * 0.3,
          borderTopRightRadius: size * 0.3,
          borderWidth: 1.5,
          borderColor: color,
          backgroundColor: "transparent",
        }}
      />
    </View>
  );
}

/** Face ID icon */
function IconFaceId({
  color = Tokens.iconColor,
  size = 18,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size * 0.7,
          height: size * 0.75,
          borderRadius: size * 0.2,
          borderWidth: 1.5,
          borderColor: color,
          backgroundColor: "transparent",
        }}
      />
    </View>
  );
}

/** Chevron right */
function IconChevronRight({
  color = Tokens.chevronColor,
  size = 20,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 0,
          height: 0,
          borderTopWidth: size * 0.2,
          borderBottomWidth: size * 0.2,
          borderLeftWidth: size * 0.25,
          borderStyle: "solid",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: color,
        }}
      />
    </View>
  );
}

/** Back arrow — chevron left */
function IconChevronLeft({
  color = "#1c1c1e",
  size = 20,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 0,
          height: 0,
          borderTopWidth: size * 0.22,
          borderBottomWidth: size * 0.22,
          borderRightWidth: size * 0.28,
          borderStyle: "solid",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderRightColor: color,
        }}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Skeleton placeholder (used while preferences are loading)
// ---------------------------------------------------------------------------
function SettingsRowSkeleton() {
  return (
    <View style={styles.skeletonRow}>
      <View style={styles.skeletonIcon} />
      <View style={styles.skeletonTextBlock}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonSubtitle} />
      </View>
      <View style={styles.skeletonToggle} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Segmented control for display mode
// ---------------------------------------------------------------------------
function DisplayModeControl({
  mode,
  onChange,
}: {
  mode: DisplayMode;
  onChange: (m: DisplayMode) => void;
}) {
  const segments: { key: DisplayMode; label: string; icon: React.ReactNode }[] =
    [
      {
        key: "light",
        label: "Claro",
        icon: (
          <IconSun
            color={
              mode === "light"
                ? Tokens.segSelectedText
                : Tokens.segUnselectedText
            }
          />
        ),
      },
      {
        key: "dark",
        label: "Escuro",
        icon: (
          <IconMoon
            color={
              mode === "dark"
                ? Tokens.segSelectedText
                : Tokens.segUnselectedText
            }
          />
        ),
      },
      {
        key: "system",
        label: "Sistema",
        icon: (
          <IconPhone
            color={
              mode === "system"
                ? Tokens.segSelectedText
                : Tokens.segUnselectedText
            }
          />
        ),
      },
    ];

  return (
    <View style={styles.segContainer}>
      {segments.map((seg) => {
        const isSelected = mode === seg.key;
        return (
          <TouchableOpacity
            key={seg.key}
            activeOpacity={0.7}
            onPress={() => onChange(seg.key)}
            style={[styles.segItem, isSelected && styles.segItemSelected]}
          >
            {seg.icon}
            <Text
              style={[
                styles.segLabel,
                {
                  color: isSelected
                    ? Tokens.segSelectedText
                    : Tokens.segUnselectedText,
                },
              ]}
            >
              {seg.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Row: icon + title + subtitle + right element
// ---------------------------------------------------------------------------
function SettingsRow({
  icon,
  title,
  subtitle,
  right,
  bottomBorder = true,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  right: React.ReactNode;
  bottomBorder?: boolean;
}) {
  return (
    <View style={[styles.row, bottomBorder && styles.rowBorder]}>
      <View style={styles.rowLeft}>
        {icon}
        <View style={styles.rowTextBlock}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.rowSubtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </View>
      {right}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionOuter}>
      <View style={styles.sectionInner}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionCard}>{children}</View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function Settings() {
  const router = useRouter();

  // --- Hooks ---
  const {
    data: preferences,
    isLoading: prefsLoading,
    updatePreference,
  } = useSettingsPreferences();

  const { mode: displayMode, setMode: setDisplayMode } = useSettingsDisplay();
  const {
    enabled: biometryEnabled,
    isSupported: biometrySupported,
    loading: biometryLoading,
    subtitle: biometrySubtitle,
    toggleBiometry,
  } = useSettingsBiometry();

  // --- Snackbar state ---
  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    message: string;
    isError: boolean;
  }>({ visible: false, message: "", isError: false });

  const showSnackbar = useCallback((message: string, isError = false) => {
    setSnackbar({ visible: true, message, isError });
  }, []);

  const dismissSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, visible: false }));
  }, []);

  // --- Handlers ---
  const handleToggle = useCallback(
    async (
      key: "notificacoesPush" | "mensagensWhatsapp" | "emailsPromocionais",
      value: boolean,
    ) => {
      const err = await updatePreference({ [key]: value });
      if (err) {
        showSnackbar(err, true);
      }
    },
    [updatePreference, showSnackbar],
  );

  const handleBiometryToggle = useCallback(
    async (value: boolean) => {
      await toggleBiometry(value);
    },
    [toggleBiometry],
  );

  // --- Render ---
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <IconChevronLeft />
        </TouchableOpacity>
        <Text style={styles.heading}>Configurações</Text>
        {/* Spacer to balance the back button */}
        <View style={{ width: 44, height: 44 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========== NOTIFICAÇÕES DE PREFERÊNCIAS ========== */}
        <Section title="NOTIFICAÇÕES DE PREFERÊNCIAS">
          {prefsLoading || !preferences ? (
            <>
              <SettingsRowSkeleton />
              <SettingsRowSkeleton />
              <SettingsRowSkeleton />
            </>
          ) : (
            <>
              <SettingsRow
                icon={
                  <IconCircle>
                    <IconBell />
                  </IconCircle>
                }
                title="Notificações de Push"
                subtitle="Alertas sobre seus serviços"
                right={
                  <Switch
                    value={preferences.notificacoesPush}
                    onValueChange={(v) => handleToggle("notificacoesPush", v)}
                    trackColor={{
                      false: Tokens.toggleOff,
                      true: Tokens.toggleOn,
                    }}
                    thumbColor={Tokens.toggleThumb}
                    ios_backgroundColor={Tokens.toggleOff}
                  />
                }
              />
              <SettingsRow
                icon={
                  <IconCircle>
                    <IconWhatsApp />
                  </IconCircle>
                }
                title="Mensagens no WhatsApp"
                subtitle="Atualizações de status"
                right={
                  <Switch
                    value={preferences.mensagensWhatsapp}
                    onValueChange={(v) => handleToggle("mensagensWhatsapp", v)}
                    trackColor={{
                      false: Tokens.toggleOff,
                      true: Tokens.toggleOn,
                    }}
                    thumbColor={Tokens.toggleThumb}
                    ios_backgroundColor={Tokens.toggleOff}
                  />
                }
              />
              <SettingsRow
                icon={
                  <IconCircle>
                    <IconMail />
                  </IconCircle>
                }
                title="E-mails Promocionais"
                subtitle="Ofertas e novidades exclusivas"
                bottomBorder={false}
                right={
                  <Switch
                    value={preferences.emailsPromocionais}
                    onValueChange={(v) => handleToggle("emailsPromocionais", v)}
                    trackColor={{
                      false: Tokens.toggleOff,
                      true: Tokens.toggleOn,
                    }}
                    thumbColor={Tokens.toggleThumb}
                    ios_backgroundColor={Tokens.toggleOff}
                  />
                }
              />
            </>
          )}
        </Section>

        {/* ========== MODO DE EXIBIÇÃO ========== */}
        <Section title="MODO DE EXIBIÇÃO">
          <View style={styles.displayModeWrapper}>
            <DisplayModeControl mode={displayMode} onChange={setDisplayMode} />
          </View>
        </Section>

        {/* ========== SEGURANÇA ========== */}
        <Section title="SEGURANÇA">
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() =>
              router.push("/(client)/(account)/settings/password" as any)
            }
          >
            <SettingsRow
              icon={
                <IconCircle>
                  <IconLock />
                </IconCircle>
              }
              title="Alterar Senha"
              subtitle="Atualize sua senha de acesso"
              right={<IconChevronRight />}
            />
          </TouchableOpacity>
          <SettingsRow
            icon={
              <IconCircle>
                <IconFaceId />
              </IconCircle>
            }
            title="Autenticação Biométrica"
            subtitle={biometryLoading ? "Verificando..." : biometrySubtitle}
            bottomBorder={false}
            right={
              biometryLoading ? (
                <ActivityIndicator size="small" color={Tokens.iconColor} />
              ) : (
                <Switch
                  value={biometryEnabled && biometrySupported}
                  onValueChange={handleBiometryToggle}
                  disabled={!biometrySupported}
                  trackColor={{
                    false: Tokens.toggleOff,
                    true: Tokens.toggleOn,
                  }}
                  thumbColor={Tokens.toggleThumb}
                  ios_backgroundColor={Tokens.toggleOff}
                />
              )
            }
          />
        </Section>

        {/* Bottom safe area spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Snackbar for errors */}
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        isError={snackbar.isError}
        onDismiss={dismissSnackbar}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Tokens.bg,
  },

  // -- Header --
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 64 : 44,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Tokens.backBtnBg,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "700",
    color: Tokens.headingColor,
    letterSpacing: -0.45,
    lineHeight: 27,
  },

  // -- Scroll --
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
  },

  // -- Section --
  sectionOuter: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  sectionInner: {
    gap: 12,
  },
  sectionHeader: {
    paddingLeft: 8,
  },
  sectionTitle: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "700",
    color: Tokens.sectionTitle,
    letterSpacing: 0.7,
    lineHeight: 21,
  },
  sectionCard: {
    backgroundColor: Tokens.cardBg,
    borderRadius: Tokens.cardRadius,
    borderWidth: 1,
    borderColor: Tokens.cardBorder,
    paddingVertical: 4,
    paddingHorizontal: 20,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 12,
    elevation: 2,
  },

  // -- Row --
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Tokens.rowBorder,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
    marginRight: 16,
  },
  rowTextBlock: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "700",
    color: Tokens.titleText,
    lineHeight: 18.75,
    marginBottom: 1,
  },
  rowSubtitle: {
    fontFamily: "Inter",
    fontSize: 13,
    fontWeight: "400",
    color: Tokens.subtitleText,
    lineHeight: 16.25,
  },

  // -- Skeleton --
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: Tokens.rowBorder,
  },
  skeletonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  skeletonTextBlock: {
    flex: 1,
    marginLeft: 14,
    gap: 6,
  },
  skeletonTitle: {
    width: "60%",
    height: 14,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  skeletonSubtitle: {
    width: "80%",
    height: 12,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  skeletonToggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },

  // -- Segmented control --
  displayModeWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 1,
  },
  segContainer: {
    flexDirection: "row",
    backgroundColor: Tokens.segBg,
    borderRadius: Tokens.segRadius,
    borderWidth: 1,
    borderColor: Tokens.cardBorder,
    padding: 6,
    gap: 8,
  },
  segItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: Tokens.segItemRadius,
    gap: 5,
  },
  segItemSelected: {
    backgroundColor: Tokens.segSelectedBg,
    borderRadius: Tokens.segItemRadius,
    borderWidth: 1,
    borderColor: Tokens.segSelectedBorder,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  segLabel: {
    fontFamily: "Inter",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19.5,
  },
});
