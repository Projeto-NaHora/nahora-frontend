import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useProfileMenu } from "@/features/profile/hooks/useProfileMenu";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { MenuItem } from "@/features/profile/components/MenuItem";
import { LogoutPopup } from "@/features/profile/components/LogoutPopup";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function Screen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const {
    user,
    initials,
    subtitle,
    menuItems,
    handleMenuItemPress,
    showLogoutPopup,
    openLogoutPopup,
    closeLogoutPopup,
    confirmLogout,
  } = useProfileMenu();

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <ProfileHeader
          initials={initials}
          name={user?.nome ?? "Usuário"}
          subtitle={subtitle}
        />

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <MenuItem item={item} onPress={handleMenuItemPress} />
              {index < menuItems.length - 1 && (
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />
              )}
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
  content: {
    paddingBottom: 40,
  },
  menuSection: {
    marginTop: 32,
    paddingHorizontal: 32,
  },
  divider: {
    height: 1,
  },
});
