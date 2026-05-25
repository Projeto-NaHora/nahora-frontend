import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ChatContent } from "@/features/chat/components/ChatContent";

export default function ClientChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  if (!chatId) return null;
  console.log(chatId)
  return <ChatContent propostaId={Number(chatId)} />;
}
