import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { Pedido } from "../types";
import { CATEGORIA_LABEL, TURNO_TIME_RANGES, getTurnoKey } from "../types";

export interface OrderSuccessContentProps {
  pedido?: Pedido;
  isLoading: boolean;
  error?: unknown;
  onBack: () => void;
  onTrackOrder: () => void;
}

function formatEndereco(endereco?: Pedido["endereco"] | null): string {
  if (!endereco) return "—";
  const parts = [endereco.logradouro, endereco.numero].filter(Boolean);
  return parts.join(", ");
}

export function OrderSuccessContent({
  pedido,
  isLoading,
  error,
  onBack,
  onTrackOrder,
}: OrderSuccessContentProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Erro ao carregar pedido.
        </Text>
      </View>
    );
  }

  const orderNumber = pedido ? `#${String(pedido.id).padStart(6, "0")}` : "#—";
  const categoriaLabel = pedido
    ? (CATEGORIA_LABEL[pedido.categoria] ?? pedido.categoria)
    : "—";
  const enderecoLabel = formatEndereco(pedido?.endereco);
  const turnoKey = getTurnoKey(pedido?.dataDesejada);
  const turnoLabel = turnoKey ? TURNO_TIME_RANGES[turnoKey]?.label : null;
  const descricao = pedido?.descricao ?? "—";

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Pressable
          style={[
            styles.headerButton,
            { backgroundColor: colors.surface + "99" },
          ]}
          onPress={onBack}
        >
          <IconSymbol
            name="chevron.left"
            size={20}
            color={colors.textPrimary}
          />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Pedido
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.body}>
          <View style={styles.successSection}>
            <View
              style={[
                styles.successIconWrapper,
                { backgroundColor: colors.success + "1A" },
              ]}
            >
              <IconSymbol name="checkmark" size={28} color={colors.success} />
            </View>
            <Text style={[styles.successTitle, { color: colors.success }]}>
              Sucesso!
            </Text>
            <Text
              style={[styles.successSubtitle, { color: colors.textSecondary }]}
            >
              O seu pedido foi cadastrado com sucesso. O profissional será
              notificado.
            </Text>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface + "4D",
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.orderNumberSection}>
              <Text
                style={[
                  styles.orderNumberLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Número do pedido
              </Text>
              <Text style={[styles.orderNumberValue, { color: colors.brand }]}>
                {orderNumber}
              </Text>
            </View>

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>
                Tipo
              </Text>
              <Text
                style={[styles.detailValue, { color: colors.textSecondary }]}
              >
                {categoriaLabel}
              </Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>
                Endereço
              </Text>
              <Text
                style={[styles.detailValue, { color: colors.textSecondary }]}
              >
                {enderecoLabel}
              </Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>
                Descrição
              </Text>
              <Text
                style={[styles.detailValue, { color: colors.textSecondary }]}
              >
                {descricao}
              </Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.textPrimary }]}>
                Turno disponível
              </Text>
              {turnoLabel ? (
                <View
                  style={[
                    styles.turnoChip,
                    {
                      backgroundColor: colors.brand + "1A",
                      borderColor: colors.brand,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.turnoIndicator,
                      { borderColor: colors.brand },
                    ]}
                  >
                    <View
                      style={[
                        styles.turnoIndicatorDot,
                        { backgroundColor: colors.brand },
                      ]}
                    />
                  </View>
                  <Text style={[styles.turnoChipText, { color: colors.brand }]}>
                    {turnoLabel}
                  </Text>
                </View>
              ) : (
                <Text
                  style={[styles.detailValue, { color: colors.textSecondary }]}
                >
                  —
                </Text>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={[styles.primaryButton, { backgroundColor: colors.brand }]}
              onPress={onTrackOrder}
            >
              <Text
                style={[styles.primaryButtonText, { color: colors.onBrand }]}
              >
                Acompanhar Pedido
              </Text>
            </Pressable>
            <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
              Política de Privacidade
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 24,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "700",
    lineHeight: 27,
    letterSpacing: -0.45,
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  body: {
    flex: 1,
    gap: 24,
    paddingTop: 12,
  },
  successSection: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
  },
  successIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    fontSize: 28,
    fontFamily: "Inter",
    fontWeight: "700",
    lineHeight: 36,
  },
  successSubtitle: {
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
  },
  card: {
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    gap: 18,
  },
  orderNumberSection: {
    alignItems: "center",
    gap: 6,
    paddingBottom: 12,
  },
  orderNumberLabel: {
    fontSize: 16,
    lineHeight: 23,
  },
  orderNumberValue: {
    fontSize: 28,
    fontFamily: "Inter",
    fontWeight: "700",
    lineHeight: 36,
  },
  divider: {
    height: 1,
    alignSelf: "stretch",
  },
  detailSection: {
    gap: 6,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "700",
    lineHeight: 22,
  },
  detailValue: {
    fontSize: 18,
    lineHeight: 27,
  },
  turnoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  turnoIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  turnoIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  turnoChipText: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "700",
    lineHeight: 22,
  },
  footer: {
    gap: 18,
    marginTop: "auto",
    paddingTop: 8,
  },
  primaryButton: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: "Inter",
    fontWeight: "700",
    lineHeight: 27,
  },
  privacyText: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
