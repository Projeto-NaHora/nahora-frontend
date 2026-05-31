import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Função para pegar as iniciais (agora do cliente)
const getInitials = (name: string) => {
  if (!name) return "CL";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase();
};

type Props = {
  pedidos: any[];
  isLoading: boolean;
  onPressDetails: (pedidoId: number) => void;
  onPressChat: (propostaId: number) => void;
};

export const ProServicesListContent: React.FC<Props> = ({
  pedidos,
  isLoading,
  onPressDetails,
  onPressChat,
}) => {
  const [activeTab, setActiveTab] = useState<"ANDAMENTO" | "HISTORICO">(
    "ANDAMENTO",
  );

  const renderItem = ({ item }: { item: any }) => {
    const isEmAndamento = item.status === "EM_ANDAMENTO";
    const valorFormatado = Number(item.orcamentoEstimado || 0).toLocaleString(
      "pt-BR",
      { style: "currency", currency: "BRL" },
    );
    const dataFormatada = item.dataDesejada
      ? new Date(item.dataDesejada).toLocaleDateString("pt-BR")
      : "A combinar";

    return (
      <View style={styles.card}>
        {/* Topo do Card: Status e Data */}
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.badge,
              isEmAndamento ? styles.badgeAndamento : styles.badgeConfirmado,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                isEmAndamento
                  ? styles.badgeTextAndamento
                  : styles.badgeTextConfirmado,
              ]}
            >
              {isEmAndamento ? "EM ANDAMENTO" : "CONFIRMADO"}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <Feather name="calendar" size={12} color="#9CA3AF" />
            <Text style={styles.dateText}>{dataFormatada}</Text>
          </View>
        </View>

        {/* Título e Valor */}
        <View style={styles.titleRow}>
          <Text style={styles.serviceTitle} numberOfLines={2}>
            {item.categoria || "Serviço"}
          </Text>
          <View style={styles.priceBubble}>
            <Text style={styles.priceText}>{valorFormatado}</Text>
          </View>
        </View>

        {/* Cliente e Chat */}
        <View style={styles.clientRow}>
          <View style={styles.clientInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(item.clienteNome)}
              </Text>
            </View>
            <Text style={styles.clientName}>
              {item.clienteNome || "Cliente"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => onPressChat(item.propostaAceitaId)}
          >
            <Feather name="message-circle" size={20} color="#F26F21" />
          </TouchableOpacity>
        </View>

        {/* Botão Detalhes */}
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => onPressDetails(item.id)}
        >
          <Text style={styles.detailsButtonText}>Ver detalhes do serviço</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Laranja */}
      <SafeAreaView style={styles.orangeHeader} edges={["top"]}>
        <Text style={styles.headerTitle}>Meus Serviços</Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "ANDAMENTO" && styles.tabActive]}
            onPress={() => setActiveTab("ANDAMENTO")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "ANDAMENTO" && styles.tabTextActive,
              ]}
            >
              Em andamento (3)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "HISTORICO" && styles.tabActive]}
            onPress={() => setActiveTab("HISTORICO")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "HISTORICO" && styles.tabTextActive,
              ]}
            >
              Histórico
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Lista com sobreposição */}
      <View style={styles.listWrapper}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#F26F21"
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={pedidos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  orangeHeader: {
    backgroundColor: "#F26F21",
    paddingHorizontal: 24,
    paddingBottom: 48, // Espaço extra para a sobreposição
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 24,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  tabActive: { backgroundColor: "#FFFFFF" },
  tabText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  tabTextActive: { color: "#F26F21" },

  listWrapper: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24, // Faz a sobreposição no header laranja
  },
  listContent: { padding: 24, paddingBottom: 100 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeAndamento: { backgroundColor: "#E6F0FF" },
  badgeConfirmado: { backgroundColor: "#FEF3C7" },
  badgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  badgeTextAndamento: { color: "#417BE0" },
  badgeTextConfirmado: { color: "#D97706" },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 12, color: "#9CA3AF" },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  serviceTitle: { fontSize: 16, fontWeight: "700", color: "#111827", flex: 1 },
  priceBubble: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priceText: { color: "#10B981", fontWeight: "700", fontSize: 13 },

  clientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  clientInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 12, fontWeight: "700", color: "#4F46E5" },
  clientName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  chatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
  },

  detailsButton: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  detailsButtonText: { color: "#111827", fontSize: 14, fontWeight: "600" },
});
