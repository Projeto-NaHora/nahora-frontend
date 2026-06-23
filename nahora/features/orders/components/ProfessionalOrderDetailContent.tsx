import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
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
  const line1 = endereco.logradouro
    ? `${endereco.logradouro}, ${endereco.numero}`
    : "";
  const line2 = `${endereco.bairro}, ${endereco.cidade}`;
  if (!line1) return line2;
  return `${line1} – ${line2}`;
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
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Erro ao carregar pedido.</Text>
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
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={[styles.backButton, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.backArrow, { color: colors.textPrimary }]}>{"←"}</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
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
        <Text style={[styles.categoryTitle, { color: colors.textPrimary }]}>{categoryLabel}</Text>

        {/* Client Card */}
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.clientRow}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.surface }]}>
              <Text style={[styles.avatarInitials, { color: colors.text }]}>{initials}</Text>
            </View>
            <View style={styles.clientInfo}>
              <Text style={[styles.clientName, { color: colors.textPrimary }]}>{pedido.clienteNome}</Text>
            </View>
          </View>

          {/* Description box inside card */}
          <View style={[styles.descriptionBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
              “{pedido.descricao}”
            </Text>
          </View>
        </View>

        {/* Fotos do pedido */}
        {pedido.fotos && pedido.fotos.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 12 }}
          >
            {pedido.fotos.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={[styles.photoThumb, { backgroundColor: colors.surface }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {/* Details Card */}
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.detailsGrid}>
            <View style={styles.detailCol}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Turno Disponível</Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{periodo}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Endereço</Text>
            </View>
          </View>
          <View style={styles.detailFull}>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
              {formatEndereco(pedido.endereco)}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          {onVerPerfil && (
            <TouchableOpacity
              onPress={onVerPerfil}
              style={[styles.secondaryButton, { backgroundColor: colors.surface }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>Ver perfil</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onMostrarInteresse}
            style={[
              onVerPerfil ? styles.primaryButton : styles.primaryButtonFull,
              { backgroundColor: colors.brand },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.primaryButtonText, { color: colors.onBrand }]}>Mostrar interesse</Text>
          </TouchableOpacity>
        </View>

        {/* Warning notice */}
        <View style={[styles.warningBox, { backgroundColor: colors.brand + "1A" }]}>
          <Text style={styles.warningIcon}>{"⚠️"}</Text>
          <Text style={[styles.warningText, { color: colors.textSecondary }]}>
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
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Inter",
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
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter",
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
    letterSpacing: -0.65,
    marginBottom: 15,
  },

  // Card
  card: {
    borderRadius: 24,
    borderWidth: 1,
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
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter",
  },
  clientInfo: {
    flex: 1,
    gap: 2,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter",
  },

  // Description box
  descriptionBox: {
    borderRadius: 16,
    padding: 16,
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: "Inter",
    fontStyle: "italic",
    fontWeight: "500",
    lineHeight: 24.38,
  },
  photoThumb: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 8,
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
    lineHeight: 19.5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
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
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Inter",
    lineHeight: 25.5,
  },
  primaryButton: {
    flex: 1.5,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonFull: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Inter",
    lineHeight: 25.5,
  },

  // Warning
  warningBox: {
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
    lineHeight: 19.25,
  },
});
