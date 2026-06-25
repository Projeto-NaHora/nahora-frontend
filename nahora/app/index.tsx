import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Sizes, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Root index screen that acts as a splash/loading screen while
 * restoreSession() is running.
 *
 * Once the session is restored (or determined missing), the AuthGuard
 * in _layout.tsx redirects to the appropriate screen.
 */
export default function SplashScreen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const logoSource =
    theme === "dark"
      ? require("../assets/images/LogoDark.png")
      : require("../assets/images/LogoSimple.png");

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Image
          source={logoSource}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel="NaHora"
        />
        <ActivityIndicator
          size="large"
          color={colors.brand}
          style={styles.spinner}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.screenHorizontal,
  },
  logo: {
    width: Sizes.logoWidth,
    height: Sizes.logoHeight,
    marginBottom: Spacing.logoToTitle,
  },
  spinner: {
    marginTop: Spacing.logoToTitle,
  },
});
