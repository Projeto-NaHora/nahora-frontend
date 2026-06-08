import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

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
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected ? styles.cardSelected : styles.cardDefault]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.radioContainer}>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.radioInner} />}
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
  cardSelected: {
    backgroundColor: "#fff2e5",
    borderColor: "#f27b24",
  },
  cardDefault: {
    backgroundColor: "#ffffff",
    borderColor: "#eaeaea",
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
    color: "#111111",
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
    color: "#8c8c8c",
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
    backgroundColor: "#f27b24",
  },
});
