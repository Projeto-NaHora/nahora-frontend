import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ChatColors } from "@/constants/theme";
import { formatMessageTime } from "@/utils/formatters";
import type { Mensagem } from "../types";

interface Props {
  mensagem: Mensagem;
  isOwn: boolean;
}

export function MessageBubble({ mensagem, isOwn }: Props) {
  const time = formatMessageTime(mensagem.criadoEm);
  const isBlocked = mensagem.bloqueadaIa;

  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      {!isOwn && (
        <Text style={styles.senderLabel}>
          {mensagem.nomeRemetente} · {time}
        </Text>
      )}
      <View
        style={[
          styles.bubble,
          isOwn ? styles.bubbleOwn : styles.bubbleOther,
          isBlocked && styles.bubbleBlocked,
        ]}
      >
        <Text
          style={[
            styles.text,
            isOwn ? styles.textOwn : styles.textOther,
            isBlocked && styles.textBlocked,
          ]}
        >
          {isBlocked
            ? "[Mensagem bloqueada por violar as diretrizes do sistema]"
            : mensagem.conteudo}
        </Text>
      </View>
      <View style={[styles.metaRow, isOwn ? styles.metaOwn : styles.metaOther]}>
        {isOwn && <Text style={styles.timeOwn}>{time}</Text>}
        {isOwn && (
          <Text
            style={[
              styles.checkmark,
              mensagem.status === "LIDA"
                ? styles.checkmarkRead
                : styles.checkmarkSent,
            ]}
          >
            {"✓✓"}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  rowOwn: {
    alignItems: "flex-end",
  },
  rowOther: {
    alignItems: "flex-start",
  },
  senderLabel: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 11,
    color: ChatColors.mutedText,
    marginBottom: 4,
    marginLeft: 4,
  },
  bubble: {
    maxWidth: 320,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  bubbleOwn: {
    backgroundColor: ChatColors.brandOrange,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bubbleOther: {
    backgroundColor: ChatColors.incomingBubble,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bubbleBlocked: {
    backgroundColor: ChatColors.surfaceLight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  text: {
    fontFamily: "Inter",
    fontSize: 15,
    lineHeight: 24,
  },
  textOwn: {
    color: ChatColors.white,
  },
  textOther: {
    color: ChatColors.darkText,
  },
  textBlocked: {
    color: ChatColors.mutedText,
    fontStyle: "italic",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  metaOwn: {
    justifyContent: "flex-end",
  },
  metaOther: {
    justifyContent: "flex-start",
  },
  timeOwn: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 11,
    color: ChatColors.mutedText,
  },
  checkmark: {
    fontSize: 14,
  },
  checkmarkRead: {
    color: ChatColors.readReceipt,
  },
  checkmarkSent: {
    color: ChatColors.readReceiptSent,
  },
});
