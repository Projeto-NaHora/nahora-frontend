import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

type Props = {
  protocolo: string;
  dataDenuncia: string;
  statusDisputa: "ANALISANDO_EVIDENCIAS" | "DECISAO_TOMADA" | "ENCERRADA";
  onBack: () => void;
  onGoHome: () => void;
  onViewDecision: () => void;
};

export const DisputeAnalysisContent: React.FC<Props> = ({
  protocolo,
  dataDenuncia,
  statusDisputa,
  onBack,
  onGoHome,
  onViewDecision,
}) => {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  // Lógica de progresso baseada no status: agora bate 100% quando a decisão sai
  const getProgress = () => {
    if (statusDisputa === "DECISAO_TOMADA" || statusDisputa === "ENCERRADA")
      return 100;
    if (statusDisputa === "ANALISANDO_EVIDENCIAS") return 65;
    return 35; // Denuncia Recebida
  };

  const isDecididaOuEncerrada = statusDisputa !== "ANALISANDO_EVIDENCIAS";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surfaceGray }]} onPress={onBack}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Disputa em Análise</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Ícone e Título Central */}
        <View style={styles.centerSection}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surfaceGray }]}>
            <MaterialCommunityIcons
              name="scale-balance"
              size={40}
              color={colors.icon}
            />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Em moderação</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Nossa equipe está analisando as evidências. Você receberá uma
            notificação assim que houver uma decisão.
          </Text>
        </View>

        {/* Linha do Tempo da Disputa */}
        <View style={[styles.timelineCard, { borderColor: colors.border }]}>
          {/* Passo 1 */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.success }]}>
              <Feather name="check" size={12} color="#FFF" />
            </View>
            <View style={styles.timelineLineActive} />
            <View style={styles.timelineTextContainer}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Denúncia recebida</Text>
              <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>{protocolo}</Text>
            </View>
          </View>

          {/* Passo 2 */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.success }]}>
              <Feather name="check" size={12} color="#FFF" />
            </View>
            <View style={styles.timelineLineActive} />
            <View style={styles.timelineTextContainer}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Evidências coletadas</Text>
              <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>Fotos e prints analisados</Text>
            </View>
          </View>

          {/* Passo 3 */}
          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineDot,
                { backgroundColor: isDecididaOuEncerrada ? colors.success : colors.brand },
              ]}
            >
              {isDecididaOuEncerrada ? (
                <Feather name="check" size={12} color="#FFF" />
              ) : (
                <Text style={styles.dotText}>...</Text>
              )}
            </View>
            <View
              style={
                isDecididaOuEncerrada
                  ? styles.timelineLineActive
                  : styles.timelineLineInactive
              }
            />
            <View style={styles.timelineTextContainer}>
              <Text
                style={[
                  styles.stepTitle,
                  { color: colors.text },
                  !isDecididaOuEncerrada && { color: "#D97706" },
                ]}
              >
                Moderação tomando decisão
              </Text>
              <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Revisão das evidências de ambas as partes
              </Text>
            </View>
          </View>

          {/* Passo 4 */}
          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineDot,
                { backgroundColor: isDecididaOuEncerrada ? colors.success : colors.surfaceGray },
              ]}
            >
              {isDecididaOuEncerrada ? (
                <Feather name="check" size={12} color="#FFF" />
              ) : (
                <Text
                  style={[
                    styles.dotText,
                    !isDecididaOuEncerrada && { color: colors.icon },
                  ]}
                >
                  4
                </Text>
              )}
            </View>
            <View style={styles.timelineTextContainer}>
              <Text
                style={[
                  styles.stepTitle,
                  { color: colors.text },
                  !isDecididaOuEncerrada && { color: colors.icon },
                ]}
              >
                Resolução e encerramento
              </Text>
            </View>
          </View>
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressSection}>
          <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceGray }]}>
            <View
              style={[styles.progressBarFill, { width: `${getProgress()}%` }]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {getProgress()}% do prazo decorrido
          </Text>
        </View>

        {/* Info Box */}
        <View style={[styles.infoBox, { backgroundColor: colors.surfaceBlue, borderColor: "#BFDBFE" }]}>
          <Feather
            name="smartphone"
            size={20}
            color="#3B82F6"
            style={{ marginTop: 2 }}
          />
          <Text style={styles.infoText}>
            Você receberá uma notificação push quando a decisão for tomada.
          </Text>
        </View>
      </ScrollView>

      {/* Botões do Rodapé */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        {isDecididaOuEncerrada ? (
          <TouchableOpacity style={styles.primaryBtn} onPress={onViewDecision}>
            <Text style={styles.primaryBtnText}>Decisão da moderação</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onGoHome}>
          <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },

  centerSection: { alignItems: "center", marginTop: 24, marginBottom: 32 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  timelineCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
    position: "relative",
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginTop: 2,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dotText: { fontSize: 10, fontWeight: "700", color: "#FFF" },
  timelineLineActive: {
    position: "absolute",
    left: 9,
    top: 22,
    bottom: -24,
    width: 2,
    backgroundColor: "#10B981",
    zIndex: 1,
  },
  timelineLineInactive: {
    position: "absolute",
    left: 9,
    top: 22,
    bottom: -24,
    width: 2,
    backgroundColor: "#F3F4F6",
    zIndex: 1,
  },
  timelineTextContainer: { marginLeft: 16, flex: 1 },
  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  stepSubtitle: { fontSize: 13 },

  progressSection: { marginBottom: 24 },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBarFill: { height: 8, backgroundColor: "#F26F21", borderRadius: 4 },
  progressText: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },

  infoBox: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: "#1E3A8A",
    lineHeight: 20,
  },

  footer: {
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
  },
  primaryBtn: {
    backgroundColor: "#F26F21",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryBtnText: { fontSize: 16, fontWeight: "600" },
});
