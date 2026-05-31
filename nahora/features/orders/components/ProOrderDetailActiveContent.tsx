import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CATEGORIA_LABEL,
  getTurnoKey,
  TURNO_TIME_RANGES,
  Pedido,
} from "../types";

type Props = {
  pedido: Pedido | any;
  isLoading: boolean;
  isFinishing: boolean;
  onBack: () => void;
  onIssue: () => void;
  onFinish: () => void;
};

export const ProOrderDetailActiveContent: React.FC<Props> = ({
  pedido,
  isLoading,
  isFinishing,
  onBack,
  onIssue,
  onFinish,
}) => {
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F26F21" />
      </SafeAreaView>
    );
  }

  const categoriaFormatada =
    CATEGORIA_LABEL[pedido?.categoria] || pedido?.categoria || "Serviço";
  const dataFormatada = pedido?.dataDesejada
    ? new Date(pedido.dataDesejada).toLocaleDateString("pt-BR")
    : "A combinar";
  const turnoKey = getTurnoKey(pedido?.dataDesejada);
  const turnoFormatado = turnoKey
    ? TURNO_TIME_RANGES[turnoKey].label
    : "A combinar";
  const enderecoFormatado = pedido?.endereco
    ? `${pedido.endereco.logradouro}, ${pedido.endereco.numero} - ${pedido.endereco.bairro}, ${pedido.endereco.cidade}`
    : "Endereço não informado";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          disabled={isFinishing}
        >
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhe do serviço</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
      >
        <View style={styles.titleRow}>
          <Text style={styles.serviceTitle}>{categoriaFormatada}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Em andamento</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.rowInfo}>
            <View style={styles.colInfo}>
              <Text style={styles.label}>Data</Text>
              <Text style={styles.value}>{dataFormatada}</Text>
            </View>
            <View style={styles.colInfo}>
              <Text style={styles.label}>Horário</Text>
              <Text style={styles.value}>{turnoFormatado}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.colInfo}>
            <Text style={styles.label}>Endereço</Text>
            <Text style={styles.value}>{enderecoFormatado}</Text>
          </View>
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          <Text style={styles.labelDesc}>DESCRIÇÃO</Text>
          <Text style={styles.descriptionText}>{pedido?.descricao}</Text>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>Linha do tempo</Text>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.dotGreen]} />
            <View style={styles.timelineLineActive} />
            <View style={styles.timelineTextContainer}>
              <Text style={styles.timelineTitle}>Pedido criado</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.dotGreen]} />
            <View style={styles.timelineLineActive} />
            <View style={styles.timelineTextContainer}>
              <Text style={styles.timelineTitle}>Proposta acordada</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.dotOrange]} />
            <View style={styles.timelineLineInactive} />
            <View style={styles.timelineTextContainer}>
              <Text style={[styles.timelineTitle, { color: "#F97316" }]}>
                Serviço em andamento
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.dotGray]} />
            <View style={styles.timelineTextContainer}>
              <Text style={[styles.timelineTitle, { color: "#9CA3AF" }]}>
                Concluído
              </Text>
            </View>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onIssue}
            disabled={isFinishing}
          >
            <Text style={styles.secondaryButtonText}>Tive um problema</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, isFinishing && { opacity: 0.7 }]}
            onPress={onFinish}
            disabled={isFinishing}
          >
            {isFinishing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Finalizar serviço</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  scrollContent: { flex: 1 },
  scrollInner: { padding: 24, paddingBottom: 48 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  serviceTitle: { fontSize: 24, fontWeight: "700", color: "#111827", flex: 1 },
  badge: {
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: "#417BE0", fontSize: 12, fontWeight: "600" },
  card: {
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  rowInfo: { flexDirection: "row", justifyContent: "space-between" },
  colInfo: { flex: 1 },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 16 },
  label: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  value: { fontSize: 15, fontWeight: "600", color: "#111827" },
  labelDesc: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 1,
    marginBottom: 8,
  },
  descriptionText: { fontSize: 15, color: "#374151", lineHeight: 22 },
  timelineContainer: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
    position: "relative",
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 2,
    zIndex: 2,
  },
  dotGreen: { backgroundColor: "#10B981" },
  dotOrange: { backgroundColor: "#F97316" },
  dotGray: { backgroundColor: "#E5E7EB" },
  timelineLineActive: {
    position: "absolute",
    left: 7,
    top: 18,
    bottom: -24,
    width: 2,
    backgroundColor: "#10B981",
    zIndex: 1,
  },
  timelineLineInactive: {
    position: "absolute",
    left: 7,
    top: 18,
    bottom: -24,
    width: 2,
    backgroundColor: "#E5E7EB",
    zIndex: 1,
  },
  timelineTextContainer: { marginLeft: 16, flex: 1 },
  timelineTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  footer: { marginTop: 24, gap: 12 },
  primaryButton: {
    backgroundColor: "#F26F21",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondaryButton: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  secondaryButtonText: { color: "#111827", fontSize: 16, fontWeight: "600" },
});
