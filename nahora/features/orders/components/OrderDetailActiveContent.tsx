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
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

type Props = {
  pedido: Pedido | any;
  isLoading: boolean;
  error: any;
  onBack: () => void;
  onChat: () => void;
  onIssue: () => void;
  isOpeningChat: boolean;
};

export const OrderDetailActiveContent: React.FC<Props> = ({
  pedido,
  isLoading,
  error,
  onBack,
  onChat,
  onIssue,
  isOpeningChat,
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

  if (error || !pedido) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Erro ao carregar detalhes do pedido.
        </Text>
        <TouchableOpacity style={styles.backButtonCenter} onPress={onBack}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // === EXTRAÇÃO SEGURA DOS DADOS ===
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
      {/* Header Fixo */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface }]} onPress={onBack}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Detalhe do Pedido</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Conteúdo rolável */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Badge (Azul para Em Andamento) */}
        <View style={styles.titleRow}>
          <Text style={[styles.serviceTitle, { color: colors.text }]}>{categoriaFormatada}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Em andamento</Text>
          </View>
        </View>

        {/* Info Card */}
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

        {/* Description Card */}
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.labelDesc, { color: colors.textSecondary }]}>DESCRIÇÃO</Text>
          <Text style={[styles.descriptionText, { color: colors.text }]}>{pedido.descricao}</Text>
        </View>

        {/* Aviso de Execução */}
        <View style={[styles.executionWarning, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="info" size={20} color={colors.brand} />
          <Text style={[styles.executionText, { color: colors.text }]}>
            O profissional já está executando o serviço. Aguarde a conclusão
            para liberar o pagamento.
          </Text>
        </View>

        {/* Timeline (Baseado no seu print) */}
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
              <Text style={[styles.timelineTitle, { color: colors.text }]}>Avaliação de propostas</Text>
            </View>
          </View>

          {/* Etapa Atual - Laranja */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.brand }]} />
            <View style={[styles.timelineLineInactive, { backgroundColor: colors.border }]} />
            <View style={styles.timelineTextContainer}>
              <Text style={[styles.timelineTitle, { color: colors.brand }]}>
                Serviço em andamento
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.border }]} />
            <View style={styles.timelineTextContainer}>
              <Text style={[styles.timelineTitle, { color: colors.textSecondary }]}>
                Concluído
              </Text>
            </View>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={[styles.footerInline, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onIssue}>
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Tive um problema</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.brand }, isOpeningChat && { opacity: 0.7 }]}
            onPress={onChat}
            disabled={isOpeningChat}
          >
            {isOpeningChat ? (
              <ActivityIndicator color={colors.onBrand} />
            ) : (
              <>
                <Feather
                  name="message-square"
                  size={20}
                  color={colors.onBrand}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.primaryButtonText, { color: colors.onBrand }]}>
                  Falar com profissional
                </Text>
              </>
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
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: "#417BE0", fontSize: 12, fontWeight: "600" },

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

  executionWarning: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  executionText: { fontSize: 14, flex: 1, lineHeight: 20 },

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

  footerInline: {
    marginTop: 24,
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
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

  errorText: { color: "#EF4444", fontSize: 16, marginBottom: 16 },
  backButtonCenter: {
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  backButtonText: { color: "#374151", fontWeight: "600" },
});
