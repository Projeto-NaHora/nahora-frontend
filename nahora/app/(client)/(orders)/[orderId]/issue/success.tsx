import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IssueSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  // Aqui criamos um número de disputa falso inspirado no seu design
  const numeroDisputa = `#DIS-${new Date().getFullYear()}-${orderId.padStart(5, "0")}`;

  // === PREVINE O BOTÃO FÍSICO DE VOLTAR DO ANDROID ===
  // Intercepta o clique no botão físico de voltar e redireciona para a Home
  // para evitar que o usuário volte para o formulário já enviado.
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleGoHome();
        return true;
      };

      // Salva a inscrição (subscription) na variável
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  const handleGoHome = () => {
    router.dismissAll();
    router.replace("/(client)/(home)");
  };

  const handleGoToOrder = () => {
    router.dismissAll();
    router.push(`/(client)/(orders)/${orderId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <TouchableOpacity style={styles.closeBtn} onPress={handleGoHome}>
          <Feather name="x" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Feather name="check" size={32} color="#10B981" />
        </View>

        <Text style={styles.title}>Problema reportado com sucesso!</Text>
        <Text style={styles.subtitle}>
          Recebemos sua denúncia e as evidências.
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Número da Disputa</Text>
            <Text style={styles.value}>{numeroDisputa}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.rowWarning}>
            <Feather
              name="clock"
              size={16}
              color="#3B82F6"
              style={{ marginTop: 2 }}
            />
            <Text style={styles.warningText}>
              Nossa equipe de moderação avaliará o caso e dará um retorno em até{" "}
              <Text style={{ fontWeight: "700" }}>48 horas</Text>.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleGoToOrder}>
          <Text style={styles.primaryBtnText}>Acompanhar análise</Text>
          <Feather
            name="arrow-right"
            size={18}
            color="#FFFFFF"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={handleGoHome}>
          <Text style={styles.secondaryBtnText}>Voltar ao inicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ... os styles permanecem idênticos, não precisei alterá-los ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  infoCard: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 13, color: "#6B7280" },
  value: { fontSize: 14, fontWeight: "700", color: "#111827" },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 16 },
  rowWarning: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  warningText: { flex: 1, fontSize: 13, color: "#3B82F6", lineHeight: 20 },
  footer: { padding: 24, gap: 12 },
  primaryBtn: {
    flexDirection: "row",
    backgroundColor: "#F26F21",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: { color: "#111827", fontSize: 16, fontWeight: "700" },
});
