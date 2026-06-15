import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useProfileMenu } from "@/features/profile/hooks/useProfileMenu";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { StatsCards } from "@/features/profile/components/StatsCards";
import { MenuItem } from "@/features/profile/components/MenuItem";
import { LogoutPopup } from "@/features/profile/components/LogoutPopup";
import { Colors, FontSizes, Fonts, LineHeights } from "@/constants/theme";
import { getApiErrorMessage } from "@/utils/apiError";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function Screen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const {
    user,
    isLoading,
    error,
    nome,
    initials,
    subtitle,
    stats,
    menuItems,
    handleMenuItemPress,
    showLogoutPopup,
    openLogoutPopup,
    closeLogoutPopup,
    confirmLogout,
    retry,
  } = useProfileMenu();

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (error) {
    console.error("[H01] Erro ao carregar perfil profissional:", error);
    const mensagem = getApiErrorMessage(
      error,
      "Erro de conexão com o servidor",
    );

    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorIcon]}>⚠️</Text>
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          Não foi possível carregar seus dados
        </Text>
        <Text style={[styles.errorDetail, { color: colors.textSecondary }]}>
          {mensagem}
        </Text>
        <Pressable
          onPress={() => retry()}
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
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <ProfileHeader
          initials={initials}
          name={nome || "Usuário"}
          subtitle={subtitle}
        />

        <StatsCards stats={stats} />

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <MenuItem item={item} onPress={handleMenuItemPress} />
              {index < menuItems.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            </React.Fragment>
          ))}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <MenuItem
            item={{
              id: "logout",
              label: "Sair da conta",
              isDanger: true,
            }}
            onPress={openLogoutPopup}
          />
        </View>
      </ScrollView>

      <LogoutPopup
        visible={showLogoutPopup}
        onConfirm={confirmLogout}
        onCancel={closeLogoutPopup}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorText: {
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
    textAlign: "center",
  },
  errorDetail: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    lineHeight: LineHeights.body,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    fontWeight: "600",
    lineHeight: LineHeights.body,
  },
  content: {
    paddingBottom: 40,
  },
  menuSection: {
    marginTop: 32,
    paddingHorizontal: 32,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f066",
  },
  logoutButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#DC2626",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
