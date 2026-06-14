// features/professional/components/ProfessionalHeader.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/utils/formatters";

export function ProfessionalHeader() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: 48, backgroundColor: colors.brand }]}>
      {/* Top row: avatar + greeting + notification bell */}
      <View style={styles.topRow}>
        <View style={styles.greetingRow}>
          <View style={[styles.avatar, { borderColor: "rgba(255,255,255,0.3)" }]}>
            <Text style={styles.avatarText}>{getInitials(user?.nome)}</Text>
          </View>
          <View style={styles.greetingText}>
            <Text style={styles.hello}>Olá,</Text>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user?.nome ?? "?"}!</Text>
              <Text style={styles.wave}>👋</Text>
            </View>
            <Text style={styles.subtitle}>Boas vendas hoje!</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.notifButton}
          activeOpacity={0.7}
          onPress={() => router.push("/(professional)/(home)/notifications")}
          >
        </TouchableOpacity>
      </View>

      {/* Tab switcher */}
      <View style={styles.tabRow}>
        <View style={styles.tab}>
          <Text style={styles.tabActiveText}>Home</Text>
          <View style={styles.tabIndicator} />
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabInactiveText}>Agenda</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: "Inter",
    fontWeight: "700",
  },
  greetingText: {
    gap: 2,
  },
  hello: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    color: "rgba(255,255,255,0.9)",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  name: {
    fontSize: 22,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  wave: {
    fontSize: 22,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  notifButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  bellIcon: {
    fontSize: 20,
  },
  notifBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4D4F",
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 8,
  },
  tabActiveText: {
    fontSize: 18,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  tabInactiveText: {
    fontSize: 18,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
    marginBottom: 24,
  },
  tabIndicator: {
    width: 120,
    height: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
  },
});
