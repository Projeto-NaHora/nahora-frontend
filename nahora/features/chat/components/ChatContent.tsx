import React, { useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { useChatColors } from "@/hooks/use-chat-colors";
import { useChatScreen } from "../hooks/useChatScreen";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { DateSeparator } from "./DateSeparator";
import { ProposalBanner } from "./ProposalBanner";
import { ChatInput } from "./ChatInput";
import type { Mensagem, DateSeparatorEntry } from "../types";

interface Props {
  propostaId: number;
}

export function ChatContent({ propostaId }: Props) {
  const router = useRouter();
  const colors = useChatColors();
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
    connectionError,
    validationError,
    clearValidationError,
  } = useChatScreen(propostaId);

  const isReadOnly =
    conversa?.status === "SOMENTE_LEITURA" || conversa?.status === "FECHADA";

  const renderItem = ({ item }: { item: Mensagem | DateSeparatorEntry }) => {
    if ("__type" in item) {
      return <DateSeparator date={item.date} />;
    }
    return (
      <MessageBubble mensagem={item} isOwn={item.remetenteId === userId} />
    );
  };

  const keyExtractor = (item: Mensagem | DateSeparatorEntry) =>
    "__type" in item ? `sep-${item.date}` : String(item.id);

  const handleScroll = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
    if (e.nativeEvent.contentOffset.y < 50 && hasMore && !isLoading) {
      loadMore();
    }
  };

  // Loading state
  if (isLoading && messageCount === 0) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.white }]} edges={["bottom"]}>
        <ChatHeader
          nome={conversa?.nomeOutroParticipante ?? "Carregando..."}
          fotoUrl={conversa?.fotoOutroParticipante}
          onBack={() => router.back()}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.brandOrange} />
          <Text style={[styles.loadingText, { color: colors.mutedText }]}>
            Carregando mensagens...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state (no cache)
  if (isError && messageCount === 0) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.white }]} edges={["bottom"]}>
        <ChatHeader
          nome={conversa?.nomeOutroParticipante ?? ""}
          fotoUrl={conversa?.fotoOutroParticipante}
          onBack={() => router.back()}
        />
        <View style={styles.center}>
          <Text style={[styles.errorIcon, { color: colors.brandOrange }]}>
            !
          </Text>
          <Text style={[styles.errorText, { color: colors.darkText }]}>
            Nao foi possivel carregar as mensagens
          </Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: colors.brandOrange }]}
            onPress={() => refresh()}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.white }]}
      edges={["bottom"]}
    >
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
            <Text style={styles.reconnectText}>
              {connectionError
                ? `Erro de conexão: ${connectionError}`
                : "Reconectando..."}
            </Text>
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

      {validationError && (
        <View style={styles.validationErrorBanner}>
          <Text style={styles.validationErrorText}>{validationError}</Text>
          <TouchableOpacity onPress={clearValidationError}>
            <Text style={styles.iaDismiss}>X</Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
      >
        {messageCount === 0 ? (
          <View style={styles.center}>
            <Text style={[styles.emptyTitle, { color: colors.darkText }]}>
              Nenhuma mensagem ainda
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedText }]}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
    marginTop: 12,
  },
  errorIcon: {
    fontSize: 48,
    fontWeight: "700",
    marginBottom: 12,
  },
  errorText: {
    fontFamily: "Inter",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 16,
  },
  retryBtn: {
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 14,
    color: "#ffffff",
  },
  emptyTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: "Inter",
    fontSize: 14,
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
  validationErrorBanner: {
    backgroundColor: "#fde8e8",
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  validationErrorText: {
    fontFamily: "Inter",
    fontSize: 12,
    color: "#dc2626",
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
