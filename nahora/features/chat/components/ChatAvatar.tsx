import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useChatColors } from "@/hooks/use-chat-colors";
import { getInitials } from "@/utils/formatters";

interface Props {
  nome: string;
  fotoUrl?: string | null;
  size?: number;
  online?: boolean;
}

export function ChatAvatar({ nome, fotoUrl, size = 42, online }: Props) {
  const colors = useChatColors();
  const initials = getInitials(nome);

  return (
    <View style={styles.wrapper}>
      {fotoUrl ? (
        <Image
          source={{ uri: fotoUrl }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.initialsCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: colors.proposalBg,
            },
          ]}
        >
          <Text style={[styles.initialsText, { fontSize: size * 0.36, color: colors.proposalText }]}>
            {initials}
          </Text>
        </View>
      )}
      {online && (
        <View
          style={[
            styles.onlineDot,
            {
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: size * 0.14,
              backgroundColor: colors.onlineGreen,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  image: {
    resizeMode: "cover",
  },
  initialsCircle: {
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontFamily: "Inter",
    fontWeight: "700",
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
