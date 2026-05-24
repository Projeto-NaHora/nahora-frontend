import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useConversations } from "../hooks/useConversations";
import type { FiltroConversaStatus, ConversaResponseDTO } from "../types";
import SearchBar from "./SearchBar";
import FilterTabs from "./FilterTabs";
import ConversationListItem from "./ConversationListItem";
import { getApiErrorMessage } from "@/utils/apiError";

function getDateLabel(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return "Hoje";
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Ontem";
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface Section {
  title: string;
  data: ConversaResponseDTO[];
}

export default function ConversationListContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filtro, setFiltro] = useState<FiltroConversaStatus>("TODAS");
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const {
    conversations,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
  } = useConversations(filtro);

  const searchFiltered = useMemo(() => {
    if (!searchText.trim()) return conversations;
    const lower = searchText.toLowerCase();
    return conversations.filter(
      (c) =>
        c.nomeOutroParticipante.toLowerCase().includes(lower) ||
        c.tituloPedido.toLowerCase().includes(lower),
    );
  }, [conversations, searchText]);

  const sections: Section[] = useMemo(() => {
    const groups: Record<string, ConversaResponseDTO[]> = {};
    for (const conv of searchFiltered) {
      const label = getDateLabel(
        conv.ultimaMensagemEnviadaEm || conv.criadoEm,
      );
      if (!groups[label]) groups[label] = [];
      groups[label].push(conv);
    }
    return Object.entries(groups).map(([title, data]) => ({ title, data }));
  }, [searchFiltered]);

  const handlePress = useCallback(
    (conversaId: number) => {
      router.push(`./${conversaId}`);
    },
    [router],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const onEndReached = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const headerHeight = insets.top + 64 + 24;

  // --- Loading (first load) ---
  if (isLoading) {
    return (
      <View style={styles.safeArea}>
        <View style={[styles.header, { paddingTop: insets.top + 64 }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerBtn}>
              <IconSymbol name="chevron.left" size={20} color="#1c1c1e" />
            </View>
            <Text style={styles.headerTitle}>Mensagens</Text>
            <View style={[styles.headerBtn, styles.invisible]} />
          </View>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F26F21" />
        </View>
      </View>
    );
  }

  // --- Error (no cached data) ---
  if (error && conversations.length === 0) {
    return (
      <View style={styles.safeArea}>
        <View style={[styles.header, { paddingTop: insets.top + 64 }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerBtn}>
              <IconSymbol name="chevron.left" size={20} color="#1c1c1e" />
            </View>
            <Text style={styles.headerTitle}>Mensagens</Text>
            <View style={[styles.headerBtn, styles.invisible]} />
          </View>
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {getApiErrorMessage(error, "Erro ao carregar conversas")}
          </Text>
          <Text style={styles.errorSubtext}>Puxe para tentar novamente</Text>
        </View>
      </View>
    );
  }

  const emptyMessage = searchText.trim()
    ? `Nenhuma conversa encontrada para "${searchText}"`
    : filtro === "ABERTA"
      ? "Nenhuma conversa aberta"
      : filtro === "FECHADA"
        ? "Nenhuma conversa encerrada"
        : "Nenhuma conversa ainda";

  return (
    <View style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: insets.top + 64 }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerBtn}>
            <IconSymbol name="chevron.left" size={20} color="#1c1c1e" />
          </View>
          <Text style={styles.headerTitle}>Mensagens</Text>
          <View style={[styles.headerBtn, styles.invisible]} />
        </View>
      </View>

      <SearchBar value={searchText} onChangeText={setSearchText} />
      <FilterTabs selected={filtro} onSelect={setFiltro} />

      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <ConversationListItem conversa={item} onPress={handlePress} />
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <IconSymbol name="bubble.left.and.bubble.right.fill" size={48} color="#D9D9D9" />
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#F26F21" />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#F26F21"]}
            tintColor="#F26F21"
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        keyboardShouldPersistTaps="handled"
        stickySectionHeadersEnabled={false}
        contentContainerStyle={
          sections.length === 0 ? styles.emptyList : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingBottom: 24,
    paddingHorizontal: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(244,244,245,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  invisible: {
    opacity: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#1c1c1e",
  },
  sectionHeader: {
    paddingHorizontal: 27,
    paddingTop: 27,
    paddingBottom: 9,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontFamily: "Inter",
    color: "#6b7280",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyList: {
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter",
    color: "#6b7280",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Inter",
    color: "#1f2937",
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: "Inter",
    color: "#9CA3AF",
    textAlign: "center",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
