import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

interface PaymentMethodCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  selected: boolean;
  badge?: string;
  onPress: () => void;
}

export function PaymentMethodCard({
  title,
  subtitle,
  icon,
  selected,
  badge,
  onPress,
}: PaymentMethodCardProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        selected
          ? { backgroundColor: colors.surface, borderColor: colors.brand }
          : { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      <View style={styles.radioContainer}>
        <View style={[styles.radio, selected && { borderColor: colors.brand }]}>
          {selected && <View style={[styles.radioInner, { backgroundColor: colors.brand }]} />}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
  },
  iconContainer: {
    marginRight: 16,
    width: 48,
    height: 48,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "#dff6e6",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1f9945",
    letterSpacing: 0.55,
    lineHeight: 16.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 17.88,
  },
  radioContainer: {
    marginLeft: 16,
    width: 24,
    height: 24,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#f27b24",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
