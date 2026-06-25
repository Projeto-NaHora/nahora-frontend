import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Fonts } from "@/constants/theme";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { getApiErrorMessage } from "@/utils/apiError";
import {
  CATEGORIA_LABEL,
  STATUS_LABEL,
  STATUS_COLORS,
} from "@/features/orders/types";
import { paymentsService } from "@/features/payments/service";

function formatCurrency(value: number | undefined | null): string {
  if (value == null) return "R$ 0,00";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getInitials(name: string): string {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .filter((_, i, arr) => i === 0 || i === arr.length - 1)
        .join("")
        .toUpperCase()
    : "??";
}

/** Formata "14 de Abril de 2026 • 10:00" */
function formatDateLong(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const dia = d.getDate();
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  const mes = meses[d.getMonth()];
  const ano = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${dia} de ${mes} de ${ano} • ${hh}:${mm}`;
}

/** Formata "14/04/2026, 14:32" */
function formatDateShort(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano}, ${hh}:${mm}`;
}

/** Maps CategoriaServico to profession label for "Ver perfil" subtitle */
function mapCategoryToProfession(categoria: string): string {
  const map: Record<string, string> = {
    ELETRICA: "Eletricista",
    PEDREIRO: "Pedreiro",
    ENCANAMENTO: "Encanador",
    PINTURA: "Pintor",
    MARCENARIA: "Marceneiro",
  };
  return map[categoria] ?? categoria;
}

/** Payment method icon name */
function getPaymentMethodIcon(
  metodo: string | undefined,
): { icon: string; label: string } {
  const map: Record<string, { icon: string; label: string }> = {
    CREDITO: { icon: "credit-card", label: "Cartão de Crédito" },
    DEBITO: { icon: "credit-card", label: "Cartão de Débito" },
    PIX: { icon: "pix", label: "PIX" },
  };
  return map[metodo ?? ""] ?? { icon: "credit-card", label: metodo ?? "—" };
}

/** Converte ArrayBuffer para base64 (React Native não tem btoa) */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let base64 = "";
  for (let i = 0; i < binary.length; i += 3) {
    const a = binary.charCodeAt(i);
    const b = binary.charCodeAt(i + 1);
    const c = binary.charCodeAt(i + 2);
    const enc1 = a >> 2;
    const enc2 = ((a & 3) << 4) | (b >> 4);
    const enc3 = ((b & 15) << 2) | (c >> 6);
    const enc4 = c & 63;
    base64 += chars[enc1] + chars[enc2];
    base64 += b ? chars[enc3] : "=";
    base64 += c ? chars[enc4] : "=";
  }
  return base64;
}

export default function HistoryDetailScreen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const { id } = useLocalSearchParams<{ id: string }>();
  const pedidoId = Number(id);

  const { data: pedido, isLoading, error } = useOrderDetail(pedidoId);

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (error || !pedido) {
    console.error(
      "[H03] Erro ao carregar detalhes do histórico:",
      error,
    );
    const mensagem = getApiErrorMessage(
      error,
      "Erro de conexão com o servidor",
    );
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          Não foi possível carregar os detalhes
        </Text>
        <Text style={[styles.errorDetail, { color: colors.textSecondary }]}>
          {mensagem}
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.retryButton,
            { backgroundColor: colors.brand },
            pressed && styles.retryButtonPressed,
          ]}
        >
          <Text style={[styles.retryButtonText, { color: colors.onBrand }]}>
            Voltar
          </Text>
        </Pressable>
      </View>
    );
  }

  const categoryLabel =
    CATEGORIA_LABEL[pedido.categoria] ?? pedido.categoria;
  const statusLabel = STATUS_LABEL[pedido.status] ?? pedido.status;
  const statusColor = STATUS_COLORS[pedido.status] ?? {
    bg: "#e3f5e7",
    text: "#1f9945",
  };
  const professionalName = pedido.profissionalAtribuidoNome ?? "—";
  const initials = getInitials(professionalName);
  const profession = mapCategoryToProfession(pedido.categoria);
  const price = pedido.valorAcordado ?? pedido.orcamentoEstimado ?? 0;
  const paymentMethod = getPaymentMethodIcon(pedido.pagamento?.metodo);
  const paymentDate = pedido.pagamento?.dataPagamento
    ? formatDateShort(pedido.pagamento.dataPagamento)
    : "—";
  const transactionCode = pedido.pagamento?.codigoTransacao ?? "—";
  const createdAt = formatDateLong(pedido.criadoEm);

  const handleDownloadRecibo = async () => {
    setDownloadingPdf(true);
    try {
      const pdfBytes = await paymentsService.baixarRecibo(pedidoId);
      const base64 = arrayBufferToBase64(pdfBytes);
      const pdfUri = `data:application/pdf;base64,${base64}`;
      await Share.share({
        url: Platform.OS === "ios" ? pdfUri : undefined,
        message: Platform.OS === "android" ? pdfUri : undefined,
      });
    } catch (err: any) {
      if (err?.message !== "User did not share") {
        Alert.alert("Erro", "Não foi possível baixar o recibo.");
      }
    }
    setDownloadingPdf(false);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: "rgba(244,244,245,0.6)" },
            pressed && styles.backButtonPressed,
          ]}
        >
          <IconSymbol name="chevron.left" size={20} color="#1c1c1e" />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {categoryLabel}
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Status bar */}
      <View
        style={[
          styles.statusBar,
          {
            backgroundColor: colors.background,
            borderBottomColor: "#eaeaea",
          },
        ]}
      >
        <Text style={styles.statusDate}>{createdAt}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor.bg },
          ]}
        >
          <Text style={[styles.statusBadgeText, { color: statusColor.text }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Prestador card */}
        <View
          style={[
            styles.prestadorCard,
            { backgroundColor: "#f8f9fa", borderColor: "#eaeaea" },
          ]}
        >
          <Text style={styles.cardSectionTitle}>Prestador</Text>

          <View style={styles.prestadorRow}>
            {/* Avatar */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            {/* Name + profession */}
            <View style={styles.prestadorInfo}>
              <Text
                style={[styles.prestadorName, { color: colors.textPrimary }]}
              >
                {professionalName}
              </Text>
              <Text
                style={[
                  styles.prestadorProfession,
                  { color: colors.textSecondary },
                ]}
              >
                {profession}
              </Text>
            </View>

            {/* Ver perfil button */}
            <Pressable
              onPress={() => {
                if (pedido.profissionalAtribuidoId) {
                  router.push(
                    `/(client)/(home)/${pedido.profissionalAtribuidoId}`,
                  );
                }
              }}
              style={({ pressed }) => [
                styles.verPerfilButton,
                {
                  backgroundColor: colors.background,
                  borderColor: "#eaeaea",
                },
                pressed && styles.verPerfilPressed,
              ]}
            >
              <IconSymbol name="person.fill" size={14} color="#111111" />
              <Text style={styles.verPerfilText}>Ver perfil</Text>
            </Pressable>
          </View>
        </View>

        {/* Detalhes do Serviço card */}
        <View
          style={[
            styles.detailsCard,
            {
              backgroundColor: colors.background,
              borderColor: "#eaeaea",
            },
          ]}
        >
          <Text style={styles.cardSectionTitle}>Detalhes do Serviço</Text>

          <View style={styles.detailContent}>
            {/* Valor pago */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Valor pago</Text>
              <Text
                style={[styles.detailValue, { color: colors.textPrimary }]}
              >
                {formatCurrency(price)}
              </Text>
            </View>

            {/* Método */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Método</Text>
              <Text
                style={[styles.detailValueMeta, { color: colors.textPrimary }]}
              >
                {paymentMethod.label}
              </Text>
            </View>

            {/* Data */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Data</Text>
              <Text
                style={[styles.detailValue, { color: colors.textPrimary }]}
              >
                {paymentDate}
              </Text>
            </View>

            {/* Transação */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transação</Text>
              <Text style={styles.transactionCode}>{transactionCode}</Text>
            </View>
          </View>
        </View>

        {/* Baixar Recibo button */}
        <Pressable
          onPress={handleDownloadRecibo}
          disabled={downloadingPdf}
          style={({ pressed }) => [
            styles.downloadButton,
            {
              backgroundColor: "#f8f9fa",
              borderColor: "#eaeaea",
            },
            pressed && styles.downloadPressed,
            downloadingPdf && { opacity: 0.6 },
          ]}
        >
          <IconSymbol name="doc.text.fill" size={16} color="#f27b24" />
          <Text style={styles.downloadText}>
            {downloadingPdf ? "Baixando..." : "Baixar Recibo"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorText: {
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
    textAlign: "center",
  },
  errorDetail: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 30,
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },

  // Status bar
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  statusDate: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 19.5,
    color: "#8c8c8c",
  },
  statusBadge: {
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusBadgeText: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16.5,
    letterSpacing: 0.55,
  },

  // Scroll
  scroll: {
    flex: 1,
    backgroundColor: "rgba(248,249,250,0.3)",
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },

  // Prestador card
  prestadorCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 16,
  },
  cardSectionTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22.5,
    color: "#111111",
    paddingHorizontal: 4,
  },
  prestadorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff2e5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    color: "#e67215",
  },
  prestadorInfo: {
    flex: 1,
    gap: 0,
  },
  prestadorName: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
  },
  prestadorProfession: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 19.5,
  },
  verPerfilButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  verPerfilPressed: {
    opacity: 0.7,
  },
  verPerfilText: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19.5,
    color: "#111111",
  },

  // Details card
  detailsCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
    gap: 16,
  },
  detailContent: {
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 21,
    color: "#8c8c8c",
  },
  detailValue: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  detailValueMeta: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 21,
  },
  transactionCode: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 19.5,
    color: "#8c8c8c",
  },

  // Download button
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    marginTop: 4,
  },
  downloadPressed: {
    opacity: 0.7,
  },
  downloadText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    color: "#f27b24",
  },
});
