import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatAvatar } from "./ChatAvatar";
import { useChatColors } from "@/hooks/use-chat-colors";

interface Props {
  nome: string;
  fotoUrl?: string | null;
  online?: boolean;
  onBack: () => void;
  onMenu?: () => void;
}

export function ChatHeader({ nome, fotoUrl, online, onBack, onMenu }: Props) {
  const colors = useChatColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8 },
        {
          backgroundColor: colors.white,
          borderBottomColor: colors.borderSubtle,
        },
      ]}
    >
      <View style={styles.topRow}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surfaceLight }]}
          onPress={onBack}
        >
          <Text style={[styles.chevron, { color: colors.darkText }]}>{"<"}</Text>
        </TouchableOpacity>

        <View style={styles.profile}>
          <ChatAvatar nome={nome} fotoUrl={fotoUrl} size={42} online={online} />
          <View style={styles.profileText}>
            <Text
              style={[styles.name, { color: colors.darkText }]}
              numberOfLines={1}
            >
              {nome}
            </Text>
            <View style={styles.statusRow}>
              {online && (
                <View
                  style={[
                    styles.greenDot,
                    { backgroundColor: colors.onlineGreen },
                  ]}
                />
              )}
              <Text
                style={[
                  styles.status,
                  online
                    ? { color: colors.onlineGreen }
                    : { color: colors.mutedText },
                ]}
              >
                {online ? "Online agora" : "Offline"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.menuBtn} onPress={onMenu}>
          <Text style={[styles.dots, { color: colors.darkText }]}>{"..."}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
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
    justifyContent: "center",
    alignItems: "center",
  },
  chevron: {
    fontSize: 20,
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
  },
  status: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 12,
  },
  menuBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dots: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 2,
  },
});
