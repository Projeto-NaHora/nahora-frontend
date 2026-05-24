import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { ChatAvatar } from "./ChatAvatar";
import { ChatColors } from "@/constants/theme";

interface Props {
  nome: string;
  fotoUrl?: string | null;
  online?: boolean;
  onBack: () => void;
  onMenu?: () => void;
}

export function ChatHeader({ nome, fotoUrl, online, onBack, onMenu }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.chevron}>{"<"}</Text>
        </TouchableOpacity>

        <View style={styles.profile}>
          <ChatAvatar nome={nome} fotoUrl={fotoUrl} size={42} online={online} />
          <View style={styles.profileText}>
            <Text style={styles.name} numberOfLines={1}>
              {nome}
            </Text>
            <View style={styles.statusRow}>
              {online && <View style={styles.greenDot} />}
              <Text style={[styles.status, online && styles.statusOnline]}>
                {online ? "Online agora" : "Offline"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.menuBtn} onPress={onMenu}>
          <Text style={styles.dots}>{"..."}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:
      Platform.OS === "ios" ? "rgba(255,255,255,0.9)" : ChatColors.white,
    borderBottomWidth: 1,
    borderBottomColor: ChatColors.borderSubtle,
    paddingTop: Platform.OS === "ios" ? 50 : 8,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ChatColors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
  },
  chevron: {
    fontSize: 20,
    color: ChatColors.darkText,
    fontWeight: "700",
  },
  profile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 12,
  },
  profileText: {
    gap: 2,
  },
  name: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 16,
    color: ChatColors.darkText,
    maxWidth: 180,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ChatColors.onlineGreen,
  },
  status: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 12,
    color: ChatColors.mutedText,
  },
  statusOnline: {
    color: ChatColors.onlineGreen,
  },
  menuBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dots: {
    fontSize: 20,
    color: ChatColors.darkText,
    fontWeight: "700",
    letterSpacing: 2,
  },
});
