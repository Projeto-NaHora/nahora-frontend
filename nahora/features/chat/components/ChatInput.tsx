import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ChatColors } from "@/constants/theme";

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
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={onAttachment}
        disabled={disabled}
      >
        <Text style={styles.attachmentIcon}>+</Text>
      </TouchableOpacity>

      <TextInput
        style={[
          styles.input,
          disabled && styles.inputDisabled,
        ]}
        value={text}
        onChangeText={setText}
        placeholder={disabled ? "Conversa encerrada" : placeholder}
        placeholderTextColor={ChatColors.mutedText}
        editable={!disabled}
        multiline={false}
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />

      <TouchableOpacity
        style={[
          styles.sendBtn,
          (!text.trim() || disabled) && styles.sendBtnDisabled,
        ]}
        onPress={handleSend}
        disabled={!text.trim() || disabled || isSending}
      >
        {isSending ? (
          <ActivityIndicator color={ChatColors.white} size="small" />
        ) : (
          <Text style={styles.sendIcon}>{">"}</Text>
        )}
      </TouchableOpacity>
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
    borderTopColor: ChatColors.borderSubtle,
    backgroundColor: ChatColors.white,
    gap: 12,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ChatColors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
  },
  attachmentIcon: {
    fontSize: 20,
    color: ChatColors.darkText,
    fontWeight: "700",
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: ChatColors.surfaceLight,
    paddingHorizontal: 16,
    fontFamily: "Inter",
    fontSize: 15,
    color: ChatColors.darkText,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ChatColors.brandOrange,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 18,
    color: ChatColors.white,
    fontWeight: "700",
  },
});
