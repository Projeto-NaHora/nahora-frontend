import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { useEarningsHistory } from "@/features/professional/historico/hooks/useEarningsHistory";
import {
  nomeMes,
  formatarMoeda,
} from "@/features/professional/historico/utils";
import { getApiErrorMessage } from "@/utils/apiError";

export default function EarningsScreen() {
  const { height: windowHeight } = useWindowDimensions();

  const {
    ganhos,
    servicos,
    isLoading,
    error,
    mesAtual,
    anoAtual,
    irParaMesAnterior,
    irParaMesProximo,
    isCurrentMonth,
  } = useEarningsHistory();

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: "#ea6c2d" }]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    const mensagem = getApiErrorMessage(error, "Erro ao carregar histórico");
    return (
      <View style={[styles.centered, { backgroundColor: "#ea6c2d" }]}>
        <Text style={styles.loadingText}>Não foi possível carregar</Text>
        <Text style={styles.loadingSubtext}>{mensagem}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      {/* ======== HEADER LARANJA ======== */}
      <View style={styles.header}>
        {/* Top bar: back + title + spacer */}
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <IconSymbol name="chevron.left" size={22} color="#ffffff" />
          </Pressable>

          <Text style={styles.headerTitle}>Meus Ganhos</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Month selector */}
        <View style={styles.monthSelector}>
          <Pressable onPress={irParaMesAnterior} hitSlop={8}>
            <IconSymbol
              name="chevron.left"
              size={23}
              color="rgba(255,255,255,0.7)"
            />
          </Pressable>

          <Text style={styles.monthText}>
            {nomeMes(mesAtual).toUpperCase()} {anoAtual}
          </Text>

          <Pressable
            onPress={irParaMesProximo}
            hitSlop={8}
            disabled={isCurrentMonth}
            style={isCurrentMonth && { opacity: 0.4 }}
          >
            <IconSymbol
              name="chevron.right"
              size={23}
              color="rgba(255,255,255,0.7)"
            />
          </Pressable>
        </View>

        {/* Valor total */}
        <View style={styles.valueSection}>
          <Text style={styles.valueLabel}>Total no mês</Text>
          <Text style={styles.valueAmount}>
            {ganhos ? formatarMoeda(ganhos.valorTotal) : "R$ 0,00"}
          </Text>
        </View>

        {/* Stats bar */}
        <View style={styles.statsOverlay}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{ganhos?.totalServicos ?? 0}</Text>
            <Text style={styles.statLabel}>SERVIÇOS</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {ganhos?.totalConcluidos ?? 0}
            </Text>
            <Text style={styles.statLabel}>CONCLUÍDOS</Text>
          </View>
        </View>
      </View>

      {/* ======== SEÇÃO BRANCA ======== */}
      <View
        style={[
          styles.mainSection,
          { minHeight: Math.max(0, windowHeight - 350) },
        ]}
      >
        {/* Histórico de Serviços header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Histórico de Serviços</Text>

          <Pressable style={styles.filterButton}>
            <Text style={styles.filterText}>Filtrar</Text>
            <MaterialIcons name="filter-list" size={18} color="#f27a24" />
          </Pressable>
        </View>

        {/* Service cards list */}
        <View style={styles.cardsContainer}>
          {Array.isArray(servicos) &&
            servicos.map((servico) => (
              <View key={servico.id} style={styles.cardMargin}>
                <View style={styles.card}>
                  {/* Top row: status badge + date */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>
                        {servico.status === "CONCLUIDO"
                          ? "RECEBIDO"
                          : servico.status.replace(/_/g, " ")}
                      </Text>
                    </View>

                    <View style={styles.dateRow}>
                      {/* Calendar icon */}
                      <View style={styles.dateIcon}>
                        <Text style={styles.dateIconText}>📅</Text>
                      </View>
                      <Text style={styles.dateText}>
                        {formatarDataRelativa(servico.dataRealizacao)}
                      </Text>
                    </View>
                  </View>

                  {/* Service name + price */}
                  <View style={styles.cardMidRow}>
                    <Text style={styles.serviceName} numberOfLines={2}>
                      {servico.descricao}
                    </Text>
                    <View style={styles.priceBadge}>
                      <Text style={styles.priceText}>
                        + {formatarMoeda(servico.valorRecebido)}
                      </Text>
                    </View>
                  </View>

                  {/* Client info */}
                  <View style={styles.clientRow}>
                    <View style={styles.clientAvatar}>
                      <Text style={styles.clientInitials}>
                        {servico.clienteIniciais}
                      </Text>
                    </View>
                    <Text style={styles.clientName}>{servico.clienteNome}</Text>

                    <View style={{ flex: 1 }} />

                    <Pressable style={styles.chatButton}>
                      <IconSymbol
                        name="bubble.left.and.bubble.right.fill"
                        size={16}
                        color="#f27a24"
                      />
                    </Pressable>
                  </View>

                  {/* Divider */}
                  <View style={styles.hr} />

                  {/* Ver recibo button */}
                  <Pressable style={styles.receiptButton}>
                    <Text style={styles.receiptButtonText}>Ver recibo</Text>
                  </Pressable>
                </View>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
}

/** Formata data ISO → "Hoje, dd/mm" ou "dd/mm" */
function formatarDataRelativa(iso: string): string {
  const date = new Date(iso);
  const hoje = new Date();
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");

  const isHoje =
    date.getFullYear() === hoje.getFullYear() &&
    date.getMonth() === hoje.getMonth() &&
    date.getDate() === hoje.getDate();

  if (isHoje) return `Hoje, ${dia}/${mes}`;

  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);
  const isOntem =
    date.getFullYear() === ontem.getFullYear() &&
    date.getMonth() === ontem.getMonth() &&
    date.getDate() === ontem.getDate();

  if (isOntem) return `Ontem, ${dia}/${mes}`;
  return `${dia}/${mes}`;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ea6c2d",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  loadingText: {
    color: "#ffffff",
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingSubtext: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: Fonts?.sans,
    fontSize: 14,
    textAlign: "center",
  },

  // ---- HEADER LARANJA ----
  header: {
    backgroundColor: "#ea6c2d",
    paddingTop: 55,
    paddingHorizontal: 27,
    paddingBottom: 36,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 23,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 46,
  },

  // ---- Month selector ----
  monthSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    marginBottom: 9,
  },
  monthText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
    letterSpacing: 0.8,
  },

  // ---- Valor total ----
  valueSection: {
    alignItems: "center",
    marginBottom: 18,
  },
  valueLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontFamily: Fonts?.sans,
    fontWeight: "400",
    marginBottom: 4,
  },
  valueAmount: {
    color: "#ffffff",
    fontSize: 41,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
  },

  // ---- Stats overlay ----
  statsOverlay: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 36,
    paddingVertical: 14,
    paddingHorizontal: 27,
    marginHorizontal: 27,
    alignItems: "center",
    justifyContent: "center",
    gap: 36,
  },
  statItem: {
    alignItems: "center",
    gap: 0,
  },
  statNumber: {
    color: "#ffffff",
    fontSize: 23,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontFamily: Fonts?.sans,
    fontWeight: "400",
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // ---- SEÇÃO BRANCA ----
  mainSection: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 36,
    paddingHorizontal: 27,
    paddingBottom: 109,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 27,
  },
  sectionTitle: {
    color: "#1f2937",
    fontSize: 20.5,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  filterText: {
    color: "#f27a24",
    fontSize: 16,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
  },

  // ---- Service Cards ----
  cardsContainer: {
    gap: 0,
  },
  cardMargin: {
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 27,
    padding: 23,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 11,
    elevation: 3,
    gap: 18,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  statusText: {
    color: "#16a34a",
    fontSize: 11,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
    letterSpacing: 0.57,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  dateIcon: {
    opacity: 0.6,
  },
  dateIconText: {
    fontSize: 14,
  },
  dateText: {
    color: "#6b7280",
    fontSize: 14,
    fontFamily: Fonts?.sans,
    fontWeight: "400",
  },

  cardMidRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceName: {
    flex: 1,
    color: "#1f2937",
    fontSize: 18,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
    lineHeight: 23,
    paddingRight: 12,
  },
  priceBadge: {
    backgroundColor: "#dcfce7",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: "flex-start",
  },
  priceText: {
    color: "#16a34a",
    fontSize: 18,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
    lineHeight: 27,
  },

  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  clientAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
  },
  clientInitials: {
    color: "#ea580c",
    fontSize: 14,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
  },
  clientName: {
    color: "#1f2937",
    fontSize: 16,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
  },
  chatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },

  hr: {
    height: 1,
    backgroundColor: "rgba(229,231,235,0.5)",
  },

  receiptButton: {
    backgroundColor: "rgba(243,244,246,0.3)",
    borderRadius: 27,
    paddingVertical: 14,
    alignItems: "center",
  },
  receiptButtonText: {
    color: "#1f2937",
    fontSize: 16,
    fontFamily: Fonts?.sans,
    fontWeight: "700",
  },
});
