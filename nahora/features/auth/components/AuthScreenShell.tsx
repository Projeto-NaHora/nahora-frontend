import React, { useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  Colors,
  FontSizes,
  Fonts,
  LetterSpacing,
  LineHeights,
  Sizes,
  Spacing,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type AuthScreenShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
};

export function AuthScreenShell({
  title,
  subtitle,
  children,
  footer,
  wide,
}: AuthScreenShellProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  /**
   * On iOS, the KeyboardAvoidingView sits inside the SafeAreaView,
   * so the vertical offset from the top of the screen is the safe-area top inset.
   * On Android with edge-to-edge, the offset also accounts for the status bar.
   */
  const keyboardVerticalOffset = Platform.select({
    ios: insets.top,
    android: insets.top + 8, // small extra breathing room on Android
    default: 0,
  });

  const logoSource =
    theme === "dark"
      ? require("../../../assets/images/LogoDark.png")
      : require("../../../assets/images/LogoSimple.png");

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={styles.container}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Image
            source={logoSource}
            style={styles.logoImage}
            resizeMode="contain"
            accessibilityLabel="NaHora"
          />

          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          <View style={wide ? styles.formAreaWide : styles.formArea}>
            {children}
          </View>
          {footer}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Spacing.screenBottom,
    alignItems: "center",
  },
  logoImage: {
    width: Sizes.logoWidth,
    height: Sizes.logoHeight,
    marginBottom: Spacing.logoToTitle,
    marginTop: 20,
  },
  titleBlock: {
    alignItems: "center",
    maxWidth: Sizes.formWidth,
  },
  title: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.title,
    lineHeight: LineHeights.title,
    fontWeight: "600",
    letterSpacing: LetterSpacing.title,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.caption,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.body,
    textAlign: "center",
    marginTop: Spacing.titleSubtitleGap,
  },
  formArea: {
    width: Sizes.formWidth,
    marginTop: Spacing.titleToForm,
  },
  formAreaWide: {
    width: "100%",
    marginTop: Spacing.titleToForm,
  },
});
