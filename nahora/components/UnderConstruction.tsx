import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Fonts, Radii, FontSizes } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface UnderConstructionProps {
  /** The route path displayed as subtitle, e.g. "app/(client)/(home)/notifications.tsx" */
  path: string;
}

/**
 * Brand-forward placeholder screen for routes still under development.
 *
 * Displays a breathing brand-colored dot, "Em construção" title,
 * the route path in monospace, and an "Em breve" badge.
 *
 * @example
 * <UnderConstruction path="app/(client)/(home)/notifications.tsx" />
 */
export function UnderConstruction({ path }: UnderConstructionProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    breathe.start();
    return () => breathe.stop();
  }, [pulseAnim]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Brand accent stripe at top */}
      <View style={[styles.accentBar, { backgroundColor: colors.brand }]} />

      <View style={styles.centered}>
        {/* Pulsing dot */}
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: colors.brand,
              opacity: pulseAnim,
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [0.6, 1],
                  }),
                },
              ],
            },
          ]}
        />

        {/* Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceAccent,
              borderColor: colors.border,
            },
          ]}
        >
          <Animated.Text style={[styles.title, { color: colors.brand }]}>
            Em construção
          </Animated.Text>

          {/* Divider */}
          <View
            style={[styles.divider, { backgroundColor: colors.brand + "30" }]}
          />

          {/* Route path subtitle */}
          <Animated.Text
            style={[styles.path, { color: colors.textSecondary }]}
            numberOfLines={3}
            ellipsizeMode="middle"
          >
            {path}
          </Animated.Text>
        </View>

        {/* "Em breve" badge */}
        <View style={[styles.badge, { backgroundColor: colors.brand }]}>
          <Animated.Text style={styles.badgeText}>Em breve</Animated.Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  accentBar: { height: 4, width: "100%" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    borderRadius: Radii.lg,
    borderWidth: 1,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: "700",
    fontFamily: Fonts.sans,
    textAlign: "center",
  },
  divider: {
    height: 1,
    width: 48,
    marginVertical: 16,
    borderRadius: 1,
  },
  path: {
    fontSize: FontSizes.body,
    fontFamily: Fonts.mono,
    textAlign: "center",
    lineHeight: 20,
  },
  badge: {
    marginTop: 28,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: Radii.pill,
  },
  badgeText: {
    color: "#FAFAFA",
    fontSize: FontSizes.caption,
    fontWeight: "600",
    fontFamily: Fonts.sans,
    letterSpacing: 0.4,
  },
});
