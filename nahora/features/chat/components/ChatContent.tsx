import React, { useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { useChatScreen } from "../hooks/useChatScreen";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { DateSeparator } from "./DateSeparator";
import { ProposalBanner } from "./ProposalBanner";
import { ChatInput } from "./ChatInput";
import { ChatColors } from "@/constants/theme";
import type { Mensagem, DateSeparatorEntry } from "../types";

interface Props {
  conversaId: number;
}

export function ChatContent({ conversaId }: Props) {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const userTipo = useAuthStore((s) => s.user?.tipo);

  const {
    messages,
    messageCount,
    isLoading,
    isError,
    loadMore,
    hasMore,
    refresh,
    sendMessage,
    isSending,
    connectionStatus,
    isConnected,
    iaBlocked,
    clearIaBlocked,
    conversa,
  } = useChatScreen(conversaId);

  const isReadOnly =
    conversa?.status === "SOMENTE_LEITURA" || conversa?.status === "FECHADA";

  const renderItem = useCallback(
    ({ item }: { item: Mensagem | DateSeparatorEntry }) => {
      if ("__type" in item) {
        return <DateSeparator date={item.date} />;
      }
      return (
        <MessageBubble mensagem={item} isOwn={item.remetenteId === userId} />
      );
    },
    [userId],
  );

  const keyExtractor = useCallback(
    (item: Mensagem | DateSeparatorEntry) =>
      "__type" in item ? `sep-${item.date}` : String(item.id),
    [],
  );

  const handleScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      if (e.nativeEvent.contentOffset.y < 50 && hasMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore],
  );

  // Loading state
  if (isLoading && messageCount === 0) {
    return (
      <View style={styles.screen}>
        <ChatHeader
          nome={conversa?.nomeOutroParticipante ?? "Carregando..."}
          fotoUrl={conversa?.fotoOutroParticipante}
          onBack={() => router.back()}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={ChatColors.brandOrange} />
          <Text style={styles.loadingText}>Carregando mensagens...</Text>
        </View>
      </View>
    );
  }

  // Error state (no cache)
  if (isError && messageCount === 0) {
    return (
      <View style={styles.screen}>
        <ChatHeader
          nome={conversa?.nomeOutroParticipante ?? ""}
          fotoUrl={conversa?.fotoOutroParticipante}
          onBack={() => router.back()}
        />
        <View style={styles.center}>
          <Text style={styles.errorIcon}>!</Text>
          <Text style={styles.errorText}>
            Nao foi possivel carregar as mensagens
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refresh()}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ChatHeader
        nome={conversa?.nomeOutroParticipante ?? ""}
        fotoUrl={conversa?.fotoOutroParticipante}
        online={true}
        onBack={() => router.back()}
      />

      {conversa?.statusProposta && (
        <ProposalBanner
          valorProposta={conversa.valorProposta ?? 0}
          statusProposta={conversa.statusProposta}
          onVerDetalhes={() =>
            router.push(`/(client)/(orders)/${conversa.pedidoId}/active`)
          }
          papel={userTipo ?? "CLIENTE"}
        />
      )}

      {connectionStatus !== "CONNECTED" &&
        connectionStatus !== "CONNECTING" && (
          <View style={styles.reconnectBanner}>
            <Text style={styles.reconnectText}>Reconectando...</Text>
          </View>
        )}

      {iaBlocked && (
        <View style={styles.iaBlockedBanner}>
          <Text style={styles.iaBlockedText}>
            Mensagem nao transmitida devido as diretrizes do sistema.
          </Text>
          <TouchableOpacity onPress={clearIaBlocked}>
            <Text style={styles.iaDismiss}>X</Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {messageCount === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>Nenhuma mensagem ainda</Text>
            <Text style={styles.emptySubtitle}>
              Envie uma mensagem para iniciar a conversa
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {isReadOnly && (
          <View style={styles.readOnlyBanner}>
            <Text style={styles.readOnlyText}>
              Esta conversa esta em modo somente leitura
            </Text>
          </View>
        )}

        <ChatInput
          onSend={sendMessage}
          disabled={isReadOnly || !isConnected}
          isSending={isSending}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ChatColors.white,
  },
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    fontFamily: "Inter",
    fontSize: 14,
    color: ChatColors.mutedText,
    marginTop: 12,
  },
  errorIcon: {
    fontSize: 48,
    color: ChatColors.brandOrange,
    fontWeight: "700",
    marginBottom: 12,
  },
  errorText: {
    fontFamily: "Inter",
    fontSize: 15,
    color: ChatColors.darkText,
    textAlign: "center",
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: ChatColors.brandOrange,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 14,
    color: ChatColors.white,
  },
  emptyTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 16,
    color: ChatColors.darkText,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: "Inter",
    fontSize: 14,
    color: ChatColors.mutedText,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  reconnectBanner: {
    backgroundColor: "#fff3cd",
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  reconnectText: {
    fontFamily: "Inter",
    fontSize: 12,
    color: "#856404",
    textAlign: "center",
  },
  iaBlockedBanner: {
    backgroundColor: "#fff3cd",
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iaBlockedText: {
    fontFamily: "Inter",
    fontSize: 12,
    color: "#856404",
    flex: 1,
  },
  iaDismiss: {
    fontSize: 16,
    color: "#856404",
    fontWeight: "700",
    marginLeft: 8,
  },
  readOnlyBanner: {
    backgroundColor: "#e6f0ff",
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  readOnlyText: {
    fontFamily: "Inter",
    fontSize: 12,
    color: "#417be0",
    textAlign: "center",
  },
});
