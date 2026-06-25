import React, { useState } from "react";
import { View,
  TextInput,Text,
  StyleSheet,
  ActivityIndicator, Pressable } from "react-native";
import { useChatColors } from "@/hooks/use-chat-colors";

interface Props {
  onSend: (text: string) => void;
  onAttachment?: () => void;
  disabled?: boolean;
  isSending?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onAttachment,
  disabled,
  isSending,
  placeholder = "Digite uma mensagem...",
}: Props) {
  const colors = useChatColors();
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderTopColor: colors.borderSubtle,
          backgroundColor: colors.white,
        },
      ]}
    >
      <Pressable
        style={[styles.iconBtn, { backgroundColor: colors.surfaceLight }]}
        onPress={onAttachment}
        disabled={disabled}
      >
        <Text style={[styles.attachmentIcon, { color: colors.darkText }]}>
          +
        </Text>
      </Pressable>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.surfaceLight, color: colors.darkText },
          disabled && styles.inputDisabled,
        ]}
        value={text}
        onChangeText={setText}
        placeholder={disabled ? "Conversa encerrada" : placeholder}
        placeholderTextColor={colors.mutedText}
        editable={!disabled}
        multiline={false}
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />

      <Pressable
        style={[
          styles.sendBtn,
          { backgroundColor: colors.brandOrange },
          (!text.trim() || disabled) && styles.sendBtnDisabled,
        ]}
        onPress={handleSend}
        disabled={!text.trim() || disabled || isSending}
      >
        {isSending ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <Text style={styles.sendIcon}>{">"}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  attachmentIcon: {
    fontSize: 20,
    fontWeight: "700",
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    fontFamily: "Inter",
    fontSize: 15,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "700",
  },
});
