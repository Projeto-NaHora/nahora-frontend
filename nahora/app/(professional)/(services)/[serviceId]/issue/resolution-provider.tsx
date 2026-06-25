import React from "react";
import { View,
  Text,
  StyleSheet,ActivityIndicator,
  Alert, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDisputaStatus } from "@/features/orders/hooks/useOrders";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

const handleWithdraw = () => {
  Alert.alert(
    "Sucesso",
    "O saldo foi liberado na sua carteira virtual para transferência.",
  );
};

export default function ResolutionProviderScreen() {
  const router = useRouter();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const { disputa, isLoading } = useDisputaStatus(Number(serviceId));
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const handleGoHome = () => {
    router.dismissAll();
    router.replace("/(professional)/(services)");
  };

  if (isLoading || !disputa?.decisao) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.success} />
      </View>
    );
  }

  const { decisao } = disputa;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Ícone de Sucesso/Vitória em Verde */}
        <View style={[styles.iconCircle, { backgroundColor: colors.surfaceGreen }]}>
          <Feather name="check-circle" size={48} color={colors.success} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Disputa Concluída</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          A moderação analisou o caso e deu parecer favorável a Você!
        </Text>

        {/* Card de Detalhes */}
        <View style={[styles.detailsCard, { backgroundColor: colors.surfaceGray, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Parecer da Moderação</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>{decisao.descricaoResultado}</Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Saldo Liberado:</Text>
            <Text style={[styles.value, { color: "#10B981" }]}>
              R$ {decisao.valorCobrado?.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.primaryBtn} onPress={handleWithdraw}>
          <Text style={styles.primaryBtnText}>Visualizar na Carteira</Text>
        </Pressable>
        <Pressable style={[styles.secondaryBtn, { backgroundColor: colors.surfaceGray }]} onPress={handleGoHome}>
          <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Voltar ao início</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  detailsCard: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  cardText: { fontSize: 15, lineHeight: 22 },
  divider: { height: 1, marginVertical: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 14, fontWeight: "500" },
  value: { fontSize: 15, fontWeight: "700" },
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
