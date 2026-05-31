import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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
  error: any;
  onBack: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
  onIssue: () => void;
};

export const OrderDetailValidationContent: React.FC<Props> = ({
  pedido,
  isLoading,
  error,
  onBack,
  onConfirm,
  isConfirming,
  onIssue,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!pedido?.prazoAutoConfirmacaoEm) return;

    const deadline = new Date(pedido.prazoAutoConfirmacaoEm).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = deadline - now;

      if (distance < 0) {
        setTimeLeft("O prazo expirou e o pagamento será liberado.");
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`Você tem ${hours}h ${minutes}min para confirmar.`);
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 60000);

    return () => clearInterval(timerId);
  }, [pedido?.prazoAutoConfirmacaoEm]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </SafeAreaView>
    );
  }

  if (error || !pedido) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Erro ao carregar detalhes do pedido.
        </Text>
        <TouchableOpacity style={styles.backButtonCenter} onPress={onBack}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const categoriaFormatada =
    CATEGORIA_LABEL[pedido.categoria] || pedido.categoria || "Serviço";
  const dataFormatada = pedido.dataDesejada
    ? new Date(pedido.dataDesejada).toLocaleDateString("pt-BR")
    : "A combinar";
  const turnoKey = getTurnoKey(pedido.dataDesejada);
  const turnoFormatado = turnoKey
    ? TURNO_TIME_RANGES[turnoKey].label
    : "A combinar";
  const enderecoFormatado = pedido.endereco
    ? `${pedido.endereco.logradouro}, ${pedido.endereco.numero} - ${pedido.endereco.bairro}, ${pedido.endereco.cidade}`
    : "Endereço não informado";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhe do Pedido</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <Text style={styles.serviceTitle}>{categoriaFormatada}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Aguardando validação</Text>
          </View>
        </View>

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

        <View style={styles.card}>
          <Text style={styles.labelDesc}>DESCRIÇÃO</Text>
          <Text style={styles.descriptionText}>{pedido.descricao}</Text>
        </View>

        {pedido.fotoConclusaoUrl && (
          <View style={styles.proofContainer}>
            <Text style={styles.sectionTitle}>Comprovante do Profissional</Text>
            <Image
              source={{ uri: pedido.fotoConclusaoUrl }}
              style={styles.proofImage}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.timerContainer}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={20}
            color="#F97316"
          />
          <Text style={styles.timerText}>
            {timeLeft || "Calculando prazo..."}
          </Text>
        </View>

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
              <Text style={styles.timelineTitle}>Proposta Acordada</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.dotGreen]} />
            <View style={styles.timelineLineActive} />
            <View style={styles.timelineTextContainer}>
              <Text style={styles.timelineTitle}>Serviço em andamento</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.dotOrange]} />
            <View style={styles.timelineLineInactive} />
            <View style={styles.timelineTextContainer}>
              <Text style={[styles.timelineTitle, { color: "#F97316" }]}>
                Serviço concluído
              </Text>
              <Text style={styles.timelineSubtitle}>
                Aguardando sua confirmação
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footerInline}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onIssue}
            disabled={isConfirming}
          >
            <Text style={styles.secondaryButtonText}>Tive um problema</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              isConfirming && styles.primaryButtonDisabled,
            ]}
            onPress={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                Validar conclusão e Avaliar
              </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
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
    backgroundColor: "#FFF3CD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: "#856404", fontSize: 12, fontWeight: "600" },
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
  proofContainer: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  proofImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    padding: 12,
    borderRadius: 8,
    marginBottom: 32,
    gap: 8,
  },
  timerText: { color: "#F97316", fontWeight: "600", fontSize: 14 },
  timelineContainer: { marginBottom: 16 },
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
  timelineSubtitle: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  footerInline: { marginTop: 24, gap: 12, backgroundColor: "#FFFFFF" },
  primaryButton: {
    backgroundColor: "#F97316",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonDisabled: { opacity: 0.7 },
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
  errorText: { color: "#EF4444", fontSize: 16, marginBottom: 16 },
  backButtonCenter: {
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  backButtonText: { color: "#374151", fontWeight: "600" },
});
