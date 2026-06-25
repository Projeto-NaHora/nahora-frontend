import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

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
  refreshing?: boolean;
  onRefresh?: () => void;
};

export const ProServicesListContent: React.FC<Props> = ({
  pedidos,
  isLoading,
  onPressDetails,
  onPressChat,
  refreshing,
  onRefresh,
}) => {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [activeTab, setActiveTab] = useState<"ANDAMENTO" | "HISTORICO">(
    "ANDAMENTO",
  );

  // Filtra localmente baseado na aba selecionada
  // Usamos os status que você enviou no Java: EM_ANDAMENTO, AGUARDANDO_VALIDACAO, EM_DISPUTA, CONCLUIDO
  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (activeTab === "ANDAMENTO") {
      return ["AGUARDANDO_PAGAMENTO", "EM_ANDAMENTO", "AGUARDANDO_VALIDACAO", "EM_DISPUTA"].includes(
        pedido.status,
      );
    }
    return pedido.status === "CONCLUIDO" || pedido.status === "CANCELADO";
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "EM_ANDAMENTO":
        return "EM ANDAMENTO";
      case "AGUARDANDO_VALIDACAO":
        return "AGUARDANDO APROVAÇÃO";
      case "EM_DISPUTA":
        return "EM DISPUTA";
      case "CONCLUIDO":
        return "CONCLUÍDO";
      default:
        return status;
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    // Usando os dados exatos do PedidoCardDTO do seu Java
    const isEmAndamento = item.status === "EM_ANDAMENTO";

    // O backend já manda a data e período ("Manhã", "Tarde") formatados
    const infoDataHorario = `${item.data || "Sem data"} ${item.periodo ? `• ${item.periodo}` : ""}`;

    return (
      <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
        {/* Topo do Card: Status e Data */}
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.badge,
              { backgroundColor: isEmAndamento ? colors.surfaceBlue : colors.surfaceYellow },
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
              {getStatusLabel(item.status)}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <Feather name="calendar" size={12} color={colors.icon} />
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>{infoDataHorario}</Text>
          </View>
        </View>

        {/* Título e Endereço */}
        <View style={styles.titleRow}>
          <Text style={[styles.serviceTitle, { color: colors.text }]} numberOfLines={2}>
            {item.titulo || "Serviço"}
          </Text>
        </View>

        <View style={styles.locationRow}>
          <Feather
            name="map-pin"
            size={14}
            color={colors.icon}
            style={{ marginTop: 2 }}
          />
          <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.endereco || "Endereço não informado"}
          </Text>
        </View>

        {/* Cliente e Chat */}
        <View style={[styles.clientRow, { borderTopColor: colors.border }]}>
          <View style={styles.clientInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(item.clienteNome)}
              </Text>
            </View>
            <Text style={[styles.clientName, { color: colors.text }]}>
              {item.clienteNome || "Cliente"}
            </Text>
          </View>

          {/* Só mostra botão de chat se não tiver concluído */}
          {activeTab === "ANDAMENTO" && (
            <TouchableOpacity
              style={[styles.chatButton, { borderColor: colors.border }]}
              // Aqui idealmente o backend enviaria a propostaId. Como é PedidoCardDTO,
              // você pode precisar ajustar a navegação do chat depois
              onPress={() => onPressChat(item.id)}
            >
              <Feather name="message-circle" size={20} color={colors.brand} />
            </TouchableOpacity>
          )}
        </View>

        {/* Botão Detalhes */}
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => onPressDetails(item.id)}
        >
          <Text style={[styles.detailsButtonText, { color: colors.text }]}>Ver detalhes do serviço</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Laranja */}
      <SafeAreaView style={[styles.orangeHeader, { backgroundColor: colors.brand }]} edges={["top"]}>
        <Text style={[styles.headerTitle, { color: colors.onBrand }]}>Meus Serviços</Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "ANDAMENTO" && { backgroundColor: colors.background }]}
            onPress={() => setActiveTab("ANDAMENTO")}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.onBrand },
                activeTab === "ANDAMENTO" && { color: colors.text },
              ]}
            >
              Em andamento
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "HISTORICO" && { backgroundColor: colors.background }]}
            onPress={() => setActiveTab("HISTORICO")}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.onBrand },
                activeTab === "HISTORICO" && { color: colors.text },
              ]}
            >
              Histórico
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Lista com sobreposição */}
      <View style={[styles.listWrapper, { backgroundColor: colors.surface }]}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.brand}
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={pedidosFiltrados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing ?? false}
                onRefresh={onRefresh}
                tintColor={colors.brand}
              />
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Feather name="inbox" size={48} color={colors.icon} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  {activeTab === "ANDAMENTO"
                    ? "Você ainda não tem serviços em andamento."
                    : "Você ainda não possui histórico de serviços."}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  orangeHeader: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 24,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 20 },
  tabText: { fontSize: 14, fontWeight: "600" },
  listWrapper: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  listContent: { padding: 24, paddingBottom: 100 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
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
  dateText: { fontSize: 12 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 12,
  },
  serviceTitle: { fontSize: 16, fontWeight: "700", flex: 1 },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 16,
  },
  locationText: { fontSize: 13, flex: 1, lineHeight: 18 },
  clientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderTopWidth: 1,
    paddingTop: 16,
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
  clientName: { fontSize: 14, fontWeight: "600" },
  chatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  detailsButtonText: { fontSize: 14, fontWeight: "600" },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
});
