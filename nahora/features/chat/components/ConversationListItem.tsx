import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { ConversaResponseDTO } from "../types";
import { CONVERSA_STATUS_LABEL, CONVERSA_STATUS_COLORS } from "../types";

interface ConversationListItemProps {
  conversa: ConversaResponseDTO;
  onPress: (conversaId: number) => void;
}

function getTimeLabel(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function ConversationListItem({
  conversa,
  onPress,
}: ConversationListItemProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [imgFailed, setImgFailed] = useState(false);
  const { propostaId, nomeOutroParticipante, fotoOutroParticipante, status } = conversa;
  const temFoto = !!fotoOutroParticipante && !imgFailed;
  const preview =
    conversa.ultimaMensagem || conversa.tituloPedido || "";
  const timeLabel = getTimeLabel(
    conversa.ultimaMensagemEnviadaEm || conversa.criadoEm,
  );
  const statusColors = CONVERSA_STATUS_COLORS[status] ?? {
    bg: "#F5F5F5",
    text: "#8E8E93",
  };

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.6}
      onPress={() => onPress(propostaId)}
    >
      <View style={styles.avatar}>
        {temFoto ? (
          <Image
            source={{ uri: fotoOutroParticipante }}
            style={styles.avatarImage}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <Text style={styles.avatarText}>
            {getInitials(nomeOutroParticipante)}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
            {nomeOutroParticipante}
          </Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>{timeLabel}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={[styles.preview, { color: colors.textSecondary }]} numberOfLines={1}>
            {preview}
          </Text>
          <View
            style={[styles.badge, { backgroundColor: statusColors.bg }]}
          >
            <Text style={[styles.badgeText, { color: statusColors.text }]}>
              {CONVERSA_STATUS_LABEL[status] ?? status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const AVATAR_SIZE = 55;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingVertical: 14,
    paddingHorizontal: 27,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#fff7ed",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarText: {
    fontSize: 21,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#f27a24",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontFamily: "Inter",
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 14,
    fontFamily: "Inter",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preview: {
    fontSize: 16,
    fontFamily: "Inter",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Inter",
    fontWeight: "600",
  },
});
