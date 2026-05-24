import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { ChatColors } from "@/constants/theme";
import { getInitials } from "@/utils/formatters";

interface Props {
  nome: string;
  fotoUrl?: string | null;
  size?: number;
  online?: boolean;
}

export function ChatAvatar({ nome, fotoUrl, size = 42, online }: Props) {
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
            },
          ]}
        >
          <Text style={[styles.initialsText, { fontSize: size * 0.36 }]}>
            {initials}
          </Text>
        </View>
      )}
      {online && <View style={[styles.onlineDot, { width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14 }]} />}
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
    backgroundColor: ChatColors.proposalBg,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontFamily: "Inter",
    fontWeight: "700",
    color: ChatColors.proposalText,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: ChatColors.onlineGreen,
    borderWidth: 2,
    borderColor: ChatColors.white,
  },
});
