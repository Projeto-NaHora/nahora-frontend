import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDisputaStatus } from "@/features/orders/hooks/useOrders";

export default function ResolutionProviderScreen() {
  const router = useRouter();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const { disputa, isLoading } = useDisputaStatus(Number(serviceId));

  const handleGoHome = () => {
    router.dismissAll();
    router.replace("/(professional)/(services)");
  };

  const handleWithdraw = () => {
    Alert.alert(
      "Sucesso",
      "O saldo foi liberado na sua carteira virtual para transferência.",
    );
  };

  if (isLoading || !disputa?.decisao) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const { decisao } = disputa;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Ícone de Sucesso/Vitória em Verde */}
        <View style={[styles.iconCircle, { backgroundColor: "#D1FAE5" }]}>
          <Feather name="check-circle" size={48} color="#10B981" />
        </View>

        <Text style={styles.title}>Disputa Concluída</Text>
        <Text style={styles.subtitle}>
          A moderação analisou o caso e deu parecer favorável a Você!
        </Text>

        {/* Card de Detalhes */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Parecer da Moderação</Text>
          <Text style={styles.cardText}>{decisao.descricaoResultado}</Text>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Saldo Liberado:</Text>
            <Text style={[styles.value, { color: "#10B981" }]}>
              R$ {decisao.valorCobrado?.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleWithdraw}>
          <Text style={styles.primaryBtnText}>Visualizar na Carteira</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleGoHome}>
          <Text style={styles.secondaryBtnText}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
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
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 8 },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  detailsCard: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  cardText: { fontSize: 15, color: "#4B5563", lineHeight: 22 },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  value: { fontSize: 15, fontWeight: "700", color: "#111827" },
  footer: { padding: 24, gap: 12 },
  primaryBtn: {
    backgroundColor: "#F26F21",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryBtnText: { color: "#111827", fontSize: 16, fontWeight: "600" },
});
