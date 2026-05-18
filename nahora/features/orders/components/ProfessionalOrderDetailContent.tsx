import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getInitials } from "@/utils/formatters";
import type { Pedido } from "../types";
import {
  CATEGORIA_LABEL,
  STATUS_LABEL,
  URGENCIA_LABEL,
} from "../types";

function getPeriodo(iso: string | undefined | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";
  const hora = date.getHours();
  if (hora < 12) return "Manhã";
  if (hora < 18) return "Tarde";
  return "Noite";
}

function formatEndereco(endereco: Pedido["endereco"]): string {
  if (!endereco) return "—";
  return `${endereco.logradouro}, ${endereco.numero} – ${endereco.bairro}, ${endereco.cidade}`;
}

function getUrgencyColors(urgencia: string): { bg: string; text: string } {
  if (urgencia === "URGENTE") return { bg: "#FFF1E6", text: "#E66A20" };
  if (urgencia === "BAIXA") return { bg: "#F0F0FF", text: "#6366F1" };
  return { bg: "#FFF8CC", text: "#D48806" };
}

export interface ProfessionalOrderDetailContentProps {
  pedido?: Pedido;
  isLoading: boolean;
  error?: Error;
  onBack: () => void;
  onVerPerfil?: () => void;
  onMostrarInteresse: () => void;
}

export function ProfessionalOrderDetailContent({
  pedido,
  isLoading,
  error,
  onBack,
  onVerPerfil,
  onMostrarInteresse,
}: ProfessionalOrderDetailContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E66A20" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar pedido.</Text>
      </View>
    );
  }

  if (!pedido) return null;

  const statusLabel = STATUS_LABEL[pedido.status] ?? "Em aberto";
  const urgenciaLabel = URGENCIA_LABEL[pedido.urgencia] ?? "Normal";
  const urgencyColors = getUrgencyColors(pedido.urgencia);
  const categoryLabel =
    CATEGORIA_LABEL[pedido.categoria] ?? pedido.categoria;
  const initials = getInitials(pedido.clienteNome);
  const periodo = getPeriodo(pedido.dataDesejada);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>{"←"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Detalhes do pedido
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Status badge */}
        <View
          style={[styles.statusBadge, { backgroundColor: urgencyColors.bg }]}
        >
          <Text style={[styles.statusBadgeText, { color: urgencyColors.text }]}>
            {statusLabel} · {urgenciaLabel}
          </Text>
        </View>

        {/* Category title */}
        <Text style={styles.categoryTitle}>{categoryLabel}</Text>

        {/* Client Card */}
        <View style={styles.card}>
          <View style={styles.clientRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{pedido.clienteNome}</Text>
            </View>
          </View>

          {/* Description box inside card */}
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              “{pedido.descricao}”
            </Text>
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <View style={styles.detailsGrid}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Turno Disponível</Text>
              <Text style={styles.detailValue}>{periodo}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Endereço</Text>
            </View>
          </View>
          <View style={styles.detailFull}>
            <Text style={styles.detailValue}>
              {formatEndereco(pedido.endereco)}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          {onVerPerfil && (
            <TouchableOpacity
              onPress={onVerPerfil}
              style={styles.secondaryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Ver perfil</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onMostrarInteresse}
            style={onVerPerfil ? styles.primaryButton : styles.primaryButtonFull}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>Mostrar interesse</Text>
          </TouchableOpacity>
        </View>

        {/* Warning notice */}
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>{"⚠️"}</Text>
          <Text style={styles.warningText}>
            Ao mostrar interesse, o cliente receberá notificação e poderá
            entrar em contato.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Inter",
    color: "#DC2626",
  },

  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    gap: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 20,
    fontWeight: "600",
    color: "#121212",
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter",
    color: "#121212",
    marginLeft: 12,
    letterSpacing: -0.5,
  },
  headerSpacer: {
    width: 40,
  },

  // Status badge
  statusBadge: {
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Inter",
    letterSpacing: 0.26,
  },

  // Category title
  categoryTitle: {
    fontSize: 26,
    fontWeight: "700",
    fontFamily: "Inter",
    color: "#121212",
    letterSpacing: -0.65,
    marginBottom: 15,
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },

  // Client info
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter",
    color: "#1D4ED8",
  },
  clientInfo: {
    flex: 1,
    gap: 2,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter",
    color: "#121212",
  },

  // Description box
  descriptionBox: {
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    padding: 16,
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: "Inter",
    fontStyle: "italic",
    fontWeight: "500",
    color: "#525252",
    lineHeight: 24.38,
  },

  // Details grid
  detailsGrid: {
    flexDirection: "row",
    marginBottom: 4,
  },
  detailCol: {
    flex: 1,
    gap: 4,
    marginBottom: 12,
  },
  detailFull: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "#A3A3A3",
    lineHeight: 19.5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    color: "#121212",
    lineHeight: 24,
  },

  // Action buttons
  actionRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 9,
    marginBottom: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Inter",
    color: "#333333",
    lineHeight: 25.5,
  },
  primaryButton: {
    flex: 1.5,
    backgroundColor: "#E66A20",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonFull: {
    flex: 1,
    backgroundColor: "#E66A20",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Inter",
    color: "#FFFFFF",
    lineHeight: 25.5,
  },

  // Warning
  warningBox: {
    backgroundColor: "#FFF8CC",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 12,
  },
  warningIcon: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "#D48806",
    lineHeight: 19.25,
  },
});
