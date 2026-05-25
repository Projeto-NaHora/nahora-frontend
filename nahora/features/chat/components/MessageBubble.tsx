import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useChatColors } from "@/hooks/use-chat-colors";
import { formatMessageTime } from "@/utils/formatters";
import type { Mensagem } from "../types";

interface Props {
  mensagem: Mensagem;
  isOwn: boolean;
}

export function MessageBubble({ mensagem, isOwn }: Props) {
  const colors = useChatColors();
  const time = formatMessageTime(mensagem.criadoEm);
  const isBlocked = mensagem.bloqueadaIa;

  const bubbleBg = isBlocked
    ? colors.surfaceLight
    : isOwn
      ? colors.brandOrange
      : colors.incomingBubble;

  const textColor = isBlocked
    ? colors.mutedText
    : isOwn
      ? colors.white
      : colors.darkText;

  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      {!isOwn && (
        <Text style={[styles.senderLabel, { color: colors.mutedText }]}>
          {mensagem.nomeRemetente} · {time}
        </Text>
      )}
      <View
        style={[
          styles.bubble,
          { backgroundColor: bubbleBg },
          isOwn ? styles.bubbleOwn : styles.bubbleOther,
          isBlocked && styles.bubbleBlocked,
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: textColor },
            isBlocked && styles.textBlocked,
          ]}
        >
          {isBlocked
            ? "[Mensagem bloqueada por violar as diretrizes do sistema]"
            : mensagem.conteudo}
        </Text>
      </View>
      <View style={[styles.metaRow, isOwn ? styles.metaOwn : styles.metaOther]}>
        {isOwn && (
          <Text style={[styles.timeOwn, { color: colors.mutedText }]}>
            {time}
          </Text>
        )}
        {isOwn && (
          <Text
            style={[
              styles.checkmark,
              {
                color:
                  mensagem.status === "LIDA"
                    ? colors.readReceipt
                    : colors.readReceiptSent,
              },
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
    marginBottom: 4,
    marginLeft: 4,
  },
  bubble: {
    maxWidth: 320,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  bubbleOwn: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bubbleOther: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bubbleBlocked: {
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
  textBlocked: {
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
  },
  checkmark: {
    fontSize: 14,
  },
});
