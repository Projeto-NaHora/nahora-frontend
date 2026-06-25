import React from "react";
import { View,
  Text,
  StyleSheet,ScrollView,
  ActivityIndicator, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
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
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
      </SafeAreaView>
    );
  }

  // Lógica para textos e cores dinâmicas baseadas no status
  const status = pedido?.status;
  const isAguardando = status === "AGUARDANDO_VALIDACAO";
  const isConcluido = status === "CONCLUIDO";
  const isEmDisputa = status === "EM_DISPUTA";
  const isEmAndamento = status === "EM_ANDAMENTO";

  const getStatusDisplay = () => {
    if (status === "AGUARDANDO_PAGAMENTO")
      return { text: "AGUARDANDO PAGAMENTO", color: "#2E7D32", bg: "#E8F5E9" };
    if (isEmAndamento)
      return { text: "EM ANDAMENTO", color: "#417BE0", bg: "#E6F0FF" };
    if (isAguardando)
      return { text: "AGUARDANDO CLIENTE", color: "#D97706", bg: colors.surfaceYellow };
    if (isConcluido)
      return { text: "CONCLUÍDO", color: "#10B981", bg: "#D1FAE5" };
    if (isEmDisputa)
      return { text: "EM DISPUTA", color: "#DC2626", bg: colors.surfaceRed };
    return { text: status || "SERVIÇO", color: "#6B7280", bg: "#F3F4F6" };
  };

  const badgeInfo = getStatusDisplay();
  const categoriaFormatada =
    CATEGORIA_LABEL[pedido?.categoria] || pedido?.categoria || "Serviço";

  const turnoKey = getTurnoKey(pedido?.dataDesejada);
  const turnoFormatado = turnoKey
    ? TURNO_TIME_RANGES[turnoKey].label
    : "A combinar";
  const enderecoFormatado = pedido?.endereco
    ? `${pedido.endereco.logradouro}, ${pedido.endereco.numero} - ${pedido.endereco.bairro}, ${pedido.endereco.cidade}`
    : "Endereço não informado";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={onBack}
          disabled={isFinishing}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Detalhe do serviço</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
      >
        <View style={styles.titleRow}>
          <Text style={[styles.serviceTitle, { color: colors.text }]}>{categoriaFormatada}</Text>
          <View style={[styles.badge, { backgroundColor: badgeInfo.bg }]}>
            <Text style={[styles.badgeText, { color: badgeInfo.color }]}>
              {badgeInfo.text}
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.rowInfo}>
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

        {/* Description Card */}
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.labelDesc, { color: colors.textSecondary }]}>DESCRIÇÃO</Text>
          <Text style={[styles.descriptionText, { color: colors.text }]}>{pedido?.descricao}</Text>
        </View>

        {/* Timeline Dinâmica */}
        <View style={styles.timelineContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Linha do tempo</Text>

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
            <View
              style={[
                styles.timelineDot,
                isAguardando || isConcluido
                  ? { backgroundColor: colors.success }
                  : { backgroundColor: colors.brand },
              ]}
            />
            <View
              style={
                isAguardando || isConcluido
                  ? { backgroundColor: colors.success, position: "absolute", left: 7, top: 18, bottom: -24, width: 2, zIndex: 1 }
                  : { backgroundColor: colors.border, position: "absolute", left: 7, top: 18, bottom: -24, width: 2, zIndex: 1 }
              }
            />
            <View style={styles.timelineTextContainer}>
              <Text
                style={[
                  styles.timelineTitle,
                  {
                    color: isAguardando || isConcluido ? colors.text : colors.brand,
                  },
                ]}
              >
                Serviço em andamento
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineDot,
                isConcluido
                  ? { backgroundColor: colors.success }
                  : isAguardando
                    ? { backgroundColor: colors.brand }
                    : { backgroundColor: colors.border },
              ]}
            />
            <View style={styles.timelineTextContainer}>
              <Text
                style={[
                  styles.timelineTitle,
                  {
                    color: isConcluido
                      ? colors.text
                      : isAguardando
                        ? colors.brand
                        : colors.textSecondary,
                  },
                ]}
              >
                {isAguardando ? "Aguardando aprovação do cliente" : "Concluído"}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          {/* Se o pedido já estiver concluído, não mostramos os botões de ação */}
          {!isConcluido && (
            <Pressable
              style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={onIssue}
              disabled={isFinishing}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Tive um problema</Text>
            </Pressable>
          )}

          {/* O botão "Finalizar serviço" só aparece se estiver de fato em andamento */}
          {isEmAndamento && (
            <Pressable
              style={[styles.primaryButton, { backgroundColor: colors.brand }, isFinishing && { opacity: 0.7 }]}
              onPress={onFinish}
              disabled={isFinishing}
            >
              {isFinishing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[styles.primaryButtonText, { color: colors.onBrand }]}>Finalizar serviço</Text>
              )}
            </Pressable>
          )}
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
  serviceTitle: {
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
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
  timelineContainer: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
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
  timelineTextContainer: { marginLeft: 16, flex: 1 },
  timelineTitle: { fontSize: 15, fontWeight: "600" },
  footer: { marginTop: 24, gap: 12 },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { fontSize: 16, fontWeight: "700" },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryButtonText: { fontSize: 16, fontWeight: "600" },
});
