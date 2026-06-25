import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Fonts } from "@/constants/theme";

interface ProfileHeaderProps {
  initials: string;
  name: string;
  subtitle: string;
  photoUri?: string | null;
}

export function ProfileHeader({
  initials,
  name,
  subtitle,
  photoUri,
}: ProfileHeaderProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      <View style={[styles.avatar, { backgroundColor: "#fef0e8" }]}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatarImage} />
        ) : (
          <Text style={[styles.avatarText, { color: "#f26f21" }]}>
            {initials}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 44,
  },
  textContainer: {
    flex: 1,
    gap: 6,
    paddingRight: 16,
  },
  name: {
    fontSize: 24,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
    lineHeight: 40,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: Fonts?.sans,
    fontWeight: "400",
    lineHeight: 25.5,
  },
  avatar: {
    width: 106,
    height: 104,
    borderRadius: 53,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 106,
    height: 104,
    borderRadius: 53,
  },
  avatarText: {
    fontSize: 30,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
    lineHeight: 27,
    textAlign: "center",
  },
});
