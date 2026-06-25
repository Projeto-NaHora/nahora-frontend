import React from "react";
import { View,
  Text,
  ScrollView,ActivityIndicator,
  StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Pedido } from "../types";
import { CATEGORIA_LABEL, STATUS_LABEL, STATUS_COLORS } from "../types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${d.getFullYear()}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function getPeriodo(iso: string): string {
  const hora = new Date(iso).getHours();
  if (hora < 12) return "Manhã";
  if (hora < 18) return "Tarde";
  return "Noite";
}

function formatEndereco(endereco: Pedido["endereco"]): string {
  if (!endereco) return "—";
  return `${endereco.logradouro}, ${endereco.numero} – ${endereco.bairro}, ${endereco.cidade}`;
}

const TIMELINE_OPEN = [
  { label: "Pedido criado" },
  { label: "Avaliação de propostas", subtitle: "Verifique os profissionais" },
  { label: "Serviço em andamento" },
  { label: "Concluído" },
];

export interface OrderDetailOpenContentProps {
  pedido?: Pedido;
  isLoading: boolean;
  error?: Error;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewProposals: () => void;
  onRate?: () => void;
  rateButtonLabel?: string;
  acceptedProposalId?: number;
}

export function OrderDetailOpenContent({
  pedido,
  isLoading,
  error,
  onBack,
  onEdit,
  onDelete,
  onViewProposals,
  onRate,
  rateButtonLabel,
  acceptedProposalId,
}: OrderDetailOpenContentProps) {
  const router = useRouter();
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

  const statusColor = STATUS_COLORS[pedido.status] ?? {
    bg: colors.surfaceAccent,
    text: "#F26F21",
  };
  const statusLabel = STATUS_LABEL[pedido.status] ?? "Em aberto";
  // Map order status to active timeline stage.
  // Stages: 0=Pedido criado, 1=Avaliacao de propostas, 2=Servico em andamento, 3=Concluido
  // activeStage = -1 means nothing active (cancelled / disputed)
  // activeStage = 4 means all stages complete
  function getActiveStage(status: string): number {
    switch (status) {
      case "ABERTO": return 1;
      case "AGUARDANDO_PAGAMENTO": return 1;
      case "EM_ANDAMENTO": return 2;
      case "AGUARDANDO_VALIDACAO": return 2;
      case "CONCLUIDO": return 4;
      default: return -1;
    }
  }
  const activeStage = getActiveStage(pedido.status);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={onBack}
          style={[styles.backButton, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.backArrow, { color: colors.text }]}>
            {"←"}
          </Text>
        </Pressable>
        <Text
          style={[styles.headerTitle, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          Detalhe do Pedido
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category + Status */}
        <View style={styles.categoryRow}>
          <Text
            style={[styles.categoryHeading, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {CATEGORIA_LABEL[pedido.categoria] ?? pedido.categoria}
          </Text>
          <View style={[styles.badge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.badgeText, { color: statusColor.text }]}>
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* Order Info Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background,
              borderColor: colors.border + "CC",
            },
          ]}
        >
          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Turno
              </Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {getPeriodo(pedido.dataDesejada)}
              </Text>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Endereço
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {formatEndereco(pedido.endereco)}
            </Text>
          </View>
        </View>

        {/* Description Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background,
              borderColor: colors.border + "CC",
            },
          ]}
        >
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.textSecondary },
            ]}
          >
            DESCRIÇÃO
          </Text>
          <Text style={[styles.descriptionText, { color: colors.text }]}>
            {pedido.descricao}
          </Text>
        </View>

        {/* Fotos do pedido */}
        {pedido.fotos && pedido.fotos.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionLabel,
                { color: colors.textSecondary },
              ]}
            >
              FOTOS
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photosScroll}
            >
              {pedido.fotos.map((uri) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  style={[styles.photoThumb, { backgroundColor: colors.surface }]}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Timeline */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background,
              borderColor: colors.border + "CC",
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Linha do tempo
          </Text>
          {TIMELINE_OPEN.map((item, index) => {
            const concluido = index < activeStage;
            const atual = index === activeStage;

            let dotColor = colors.border;
            let dotBorder = colors.border;
            if (concluido) {
              dotColor = colors.success;
              dotBorder = colors.success;
            }
            if (atual) {
              dotColor = colors.brand;
              dotBorder = colors.brand;
            }

            return (
              <View key={item.label} style={styles.timelineRow}>
                <View style={styles.timelineDotCol}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: dotColor,
                        borderColor: dotBorder,
                      },
                    ]}
                  />
                  {index < TIMELINE_OPEN.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor: concluido ? colors.success : colors.border,
                        },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineLabel,
                      {
                        color:
                          concluido || atual
                            ? colors.textPrimary
                            : colors.textSecondary,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {index === 0 && pedido.criadoEm ? (
                    <Text
                      style={[
                        styles.timelineSub,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {formatDate(pedido.criadoEm)} ·{" "}
                      {formatTime(pedido.criadoEm)}
                    </Text>
                  ) : null}
                  {"subtitle" in item && item.subtitle && atual ? (
                    <Text style={[styles.timelineSubActive, { color: colors.brand }]}>
                      {item.subtitle}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        {/* Action buttons row — hidden for CONCLUIDO */}
        {pedido.status !== "CONCLUIDO" && (
          <View style={styles.actionRow}>
            <Pressable
              onPress={onEdit}
              style={[styles.editButton, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.editButtonText, { color: colors.textPrimary }]}>
                Editar
              </Text>
            </Pressable>
            <Pressable
              onPress={onDelete}
              style={[styles.deleteButton, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.deleteButtonText, { color: colors.error }]}>Excluir</Text>
            </Pressable>
          </View>
        )}

        {/* Main CTA — depends on order status */}
        {pedido.status === "EM_ANDAMENTO" || pedido.status === "AGUARDANDO_VALIDACAO" ? (
          <Pressable
            onPress={() => {
              const chatId = acceptedProposalId ?? pedido.propostaId;
              if (chatId) {
                router.push(`/(client)/(chats)/${chatId}`);
              }
            }}
            style={[styles.ctaButton, { backgroundColor: colors.brand }]}
          >
            <Text style={[styles.ctaButtonText, { color: colors.onBrand }]}>Falar com prestador</Text>
          </Pressable>
        ) : pedido.status === "AGUARDANDO_PAGAMENTO" ? (
          <Pressable
            onPress={() => {
              router.push(`/(client)/(orders)/${pedido.id}/payment`);
            }}
            style={[styles.ctaButton, { backgroundColor: colors.brand }]}
          >
            <Text style={[styles.ctaButtonText, { color: colors.onBrand }]}>Pagar serviço</Text>
          </Pressable>
        ) : pedido.status === "ABERTO" ? (
          <Pressable
            onPress={onViewProposals}
            style={[styles.ctaButton, { backgroundColor: colors.brand }]}
          >
            <Text style={[styles.ctaButtonText, { color: colors.onBrand }]}>Verificar Propostas</Text>
          </Pressable>
        ) : pedido.status === "CONCLUIDO" && onRate ? (
          <Pressable
            onPress={onRate}
            style={[styles.ctaButton, { backgroundColor: colors.brand }]}
          >
            <Text style={[styles.ctaButtonText, { color: colors.onBrand }]}>
              {rateButtonLabel ?? "Avaliar serviço"}
            </Text>
          </Pressable>
        ) : null}
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

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 0,
    gap: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 22,
    fontWeight: "600",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter",
  },
  headerSpacer: {
    width: 44,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },

  // Category + badge
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryHeading: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter",
  },
  badge: {
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Inter",
  },

  // Cards
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },

  // Info card
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  infoCol: {
    flex: 1,
    gap: 4,
  },
  infoBlock: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "500",
  },

  // Description
  sectionLabel: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 1,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    lineHeight: 20,
  },

  // Photos
  photosScroll: {
    marginTop: 8,
  },
  photoThumb: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 8,
  },

  // Timeline
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    marginBottom: 16,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  timelineDotCol: {
    alignItems: "center",
    width: 16,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  timelineLine: {
    width: 2,
    height: 32,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 4,
  },
  timelineLabel: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "500",
  },
  timelineSub: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    marginTop: 2,
  },
  timelineSubActive: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    marginTop: 2,
  },

  // Action row
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  editButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 15,
    fontFamily: "Inter",
    fontWeight: "400",
  },
  deleteButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 15,
    fontFamily: "Inter",
    fontWeight: "400",
  },

  // CTA
  ctaButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaButtonText: {
    fontSize: 15,
    fontFamily: "Inter",
    fontWeight: "700",
  },
});
