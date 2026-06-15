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
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

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

  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface }]} onPress={onBack}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Detalhe do Pedido</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <Text style={[styles.serviceTitle, { color: colors.text }]}>{categoriaFormatada}</Text>
          <View style={[styles.badge, { backgroundColor: colors.surfaceYellow }]}>
            <Text style={styles.badgeText}>Aguardando validação</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.rowInfo}>
            <View style={styles.colInfo}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Data</Text>
              <Text style={[styles.value, { color: colors.text }]}>{dataFormatada}</Text>
            </View>
            <View style={styles.colInfo}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Horário</Text>
              <Text style={[styles.value, { color: colors.text }]}>{turnoFormatado}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.colInfo}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Endereço</Text>
            <Text style={[styles.value, { color: colors.text }]}>{enderecoFormatado}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.labelDesc, { color: colors.textSecondary }]}>DESCRIÇÃO</Text>
          <Text style={[styles.descriptionText, { color: colors.text }]}>{pedido.descricao}</Text>
        </View>

        {pedido.fotoConclusaoUrl && (
          <View style={styles.proofContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Comprovante do Profissional</Text>
            <Image
              source={{ uri: pedido.fotoConclusaoUrl }}
              style={styles.proofImage}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={[styles.timerContainer, { backgroundColor: colors.surface }]}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={20}
            color={colors.brand}
          />
          <Text style={[styles.timerText, { color: colors.brand }]}>
            {timeLeft || "Calculando prazo..."}
          </Text>
        </View>

        <View style={styles.timelineContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Linha do tempo</Text>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.success }]} />
            <View style={[styles.timelineLineActive, { backgroundColor: colors.success }]} />
            <View style={styles.timelineTextContainer}>
              <Text style={[styles.timelineTitle, { color: colors.text }]}>Pedido criado</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.success }]} />
            <View style={[styles.timelineLineActive, { backgroundColor: colors.success }]} />
            <View style={styles.timelineTextContainer}>
              <Text style={[styles.timelineTitle, { color: colors.text }]}>Proposta Acordada</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.success }]} />
            <View style={[styles.timelineLineActive, { backgroundColor: colors.success }]} />
            <View style={styles.timelineTextContainer}>
              <Text style={[styles.timelineTitle, { color: colors.text }]}>Serviço em andamento</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.brand }]} />
            <View style={[styles.timelineLineInactive, { backgroundColor: colors.border }]} />
            <View style={styles.timelineTextContainer}>
              <Text style={[styles.timelineTitle, { color: colors.brand }]}>
                Serviço concluído
              </Text>
              <Text style={[styles.timelineSubtitle, { color: colors.textSecondary }]}>
                Aguardando sua confirmação
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.footerInline, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onIssue}
            disabled={isConfirming}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Tive um problema</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: colors.brand },
              isConfirming && styles.primaryButtonDisabled,
            ]}
            onPress={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <ActivityIndicator color={colors.onBrand} />
            ) : (
              <Text style={[styles.primaryButtonText, { color: colors.onBrand }]}>
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
  container: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  scrollContent: { flex: 1 },
  scrollInner: { padding: 24, paddingBottom: 48 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  serviceTitle: { fontSize: 24, fontWeight: "700", flex: 1 },
  badge: {
    backgroundColor: "#FFF3CD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: "#856404", fontSize: 12, fontWeight: "600" },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  rowInfo: { flexDirection: "row", justifyContent: "space-between" },
  colInfo: { flex: 1 },
  divider: { height: 1, marginVertical: 16 },
  label: { fontSize: 12, marginBottom: 4 },
  value: { fontSize: 15, fontWeight: "600" },
  labelDesc: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  descriptionText: { fontSize: 15, lineHeight: 22 },
  proofContainer: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },
  proofImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 32,
    gap: 8,
  },
  timerText: { fontWeight: "600", fontSize: 14 },
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
  timelineTextContainer: { marginLeft: 16, flex: 1 },
  timelineTitle: { fontSize: 15, fontWeight: "600" },
  timelineSubtitle: { fontSize: 13, marginTop: 2 },
  footerInline: { marginTop: 24, gap: 12 },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryButtonText: { fontSize: 16, fontWeight: "700" },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryButtonText: { fontSize: 16, fontWeight: "600" },
  errorText: { fontSize: 16, marginBottom: 16 },
  backButtonCenter: {
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: { fontWeight: "600" },
});
