import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ChatContent } from "@/features/chat/components/ChatContent";

export default function ProfessionalChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  if (!chatId) return null;
  return <ChatContent propostaId={Number(chatId)} />;
}
