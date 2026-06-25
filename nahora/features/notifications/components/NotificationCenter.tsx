// features/notifications/components/NotificationCenter.tsx
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Fonts } from "@/constants/theme";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationSection } from "./NotificationSection";

export function NotificationCenter() {
  const {
    agrupadas,
    isLoading,
    error,
    unreadCount,
    handlePress,
    handleClearAll,
  } = useNotifications();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificações</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
        <View style={styles.headerActions}>
          {agrupadas.length > 0 && (
            <Pressable onPress={handleClearAll} style={styles.clearButton}>
              <Text style={styles.clearText}>Limpar</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F97415" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>Erro ao carregar notificações</Text>
        </View>
      ) : agrupadas.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>Nenhuma notificação</Text>
        </View>
      ) : (
        <FlatList
          data={agrupadas}
          keyExtractor={(grupo) => grupo.secao}
          renderItem={({ item: grupo }) => (
            <NotificationSection
              secao={grupo.secao}
              notificacoes={grupo.notificacoes}
              onPress={handlePress}
            />
          )}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 22,
    fontWeight: "700",
    color: "#1c1c1e",
  },
  badge: {
    marginLeft: 10,
    backgroundColor: "#F97415",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerActions: {
    flex: 1,
    alignItems: "flex-end",
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "600",
    color: "#F97415",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 4,
  },
  emptyText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    color: "#8e8e93",
  },
});