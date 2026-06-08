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
  isFavorableToClient: boolean;
  valor: string;
  dataDecisao: string;
  descricaoResultado?: string; // 👈 Adicionamos a mensagem real do Admin aqui
  profissionalNome?: string;
  onGoHome: () => void;
  onContest?: () => void;
  onPay?: () => void;
};

export const DisputeDecisionContent: React.FC<Props> = ({
  isFavorableToClient,
  valor,
  dataDecisao,
  descricaoResultado,
  profissionalNome = "O profissional",
  onGoHome,
  onContest,
  onPay,
}) => {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surfaceGray }]} onPress={onGoHome}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Resultado da Disputa</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ícone e Título Principal */}
        <View style={styles.centerSection}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isFavorableToClient ? colors.surfaceGreen : colors.surfaceBlue },
            ]}
          >
            {isFavorableToClient ? (
              <Feather name="check" size={40} color="#10B981" />
            ) : (
              <MaterialCommunityIcons
                name="scale-balance"
                size={40}
                color="#60A5FA"
              />
            )}
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {isFavorableToClient ? "Resolvido a seu favor" : "Pedido concluído"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isFavorableToClient
              ? "Nossa equipe analisou as evidências e tomou uma decisão. Veja o resultado abaixo."
              : "Nossa equipe analisou as evidências e entendeu que o serviço foi entregue. O pagamento será processado."}
          </Text>
        </View>

        {/* Card Principal de Resultado */}
        <View
          style={[
            styles.resultCard,
            { backgroundColor: isFavorableToClient ? colors.surfaceGreen : colors.surfaceBlue, borderColor: isFavorableToClient ? "#A7F3D0" : "#BFDBFE" },
          ]}
        >
          <Text
            style={[
              styles.resultHeader,
              isFavorableToClient ? styles.textGreen : styles.textBlue,
            ]}
          >
            {isFavorableToClient
              ? "RESULTADO — FAVORÁVEL AO CLIENTE"
              : "RESULTADO — PEDIDO CONCLUÍDO"}
          </Text>

          {/* 👇 Exibe o texto do Admin, ou um fallback se não vier nada */}
          <Text style={[styles.resultDescription, { color: colors.textSecondary }]}>
            {descricaoResultado ||
              (isFavorableToClient
                ? "O serviço não foi executado conforme combinado. O pedido foi cancelado e nenhum valor será cobrado."
                : "As evidências mostram que o serviço foi realizado conforme o escopo combinado. O pagamento será liberado ao profissional.")}
          </Text>

          {/* Inner Card Branco */}
          <View style={[styles.innerWhiteCard, { backgroundColor: colors.background }]}>
            <Text
              style={[
                styles.innerTitle,
                { color: colors.text },
                isFavorableToClient ? styles.textGreen : styles.textBlue,
              ]}
            >
              {isFavorableToClient
                ? "Nenhum valor cobrado"
                : "Realize o pagamento"}
            </Text>
            <Text style={[styles.innerSubtitle, { color: colors.textSecondary }]}>
              {isFavorableToClient ? "R$ 0,00 · Pedido cancelado" : valor}
            </Text>
          </View>
        </View>

        {/* Card de Ação / Aviso */}
        {isFavorableToClient ? (
          <View style={[styles.warningCard, { backgroundColor: colors.surfaceYellow, borderColor: "#FDE68A" }]}>
            <Text style={styles.warningHeader}>AÇÃO SOBRE O PROFISSIONAL</Text>
            <Text style={[styles.warningText, { color: colors.textSecondary }]}>
              {profissionalNome} recebeu uma{" "}
              <Text style={styles.boldText}>advertência formal</Text>. Em caso
              de reincidência, a conta poderá ser suspensa por 7 dias.
            </Text>
          </View>
        ) : (
          <View style={[styles.infoRowCard, { backgroundColor: colors.surfaceYellow, borderColor: "#FDE68A" }]}>
            <Feather
              name="info"
              size={18}
              color="#92400E"
              style={{ marginTop: 2 }}
            />
            <Text style={styles.infoTextWarning}>
              Caso discorde desta decisão, você pode contestar em até 24h após a
              notificação.
            </Text>
          </View>
        )}

        {/* A Linha do tempo fake que ficava aqui foi removida para limpar a tela! */}
      </ScrollView>

      {/* Botões Dinâmicos */}
      <View style={styles.footer}>
        {!isFavorableToClient ? (
          <>
            <TouchableOpacity style={styles.primaryBtn} onPress={onPay}>
              <Text style={styles.primaryBtnText}>Pagar o serviço</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: colors.surfaceGray }]} onPress={onContest}>
              <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Contestar decisão</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.primaryBtn} onPress={onGoHome}>
            <Text style={styles.primaryBtnText}>Voltar ao Início</Text>
          </TouchableOpacity>
        )}
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
  centerSection: { alignItems: "center", marginTop: 16, marginBottom: 32 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },

  resultCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  resultHeader: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  textGreen: { color: "#10B981" },
  textBlue: { color: "#3B82F6" },
  resultDescription: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 16,
  },

  innerWhiteCard: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  innerTitle: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  innerSubtitle: { fontSize: 13 },

  warningCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 32,
  },
  warningHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: "#D97706",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  warningText: { fontSize: 13, lineHeight: 20 },
  boldText: { fontWeight: "700" },

  infoRowCard: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 32,
  },
  infoTextWarning: { flex: 1, fontSize: 13, color: "#B45309", lineHeight: 18 },

  footer: { padding: 24, gap: 12 },
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
  },
  secondaryBtnText: { fontSize: 16, fontWeight: "600" },
});
