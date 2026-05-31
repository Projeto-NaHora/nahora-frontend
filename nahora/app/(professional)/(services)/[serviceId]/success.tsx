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

export default function ProFinishSuccessScreen() {
  const router = useRouter();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleGoHome();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  const handleGoHome = () => {
    router.dismissAll();
    router.replace("/(professional)/(home)");
  };

  const handleTrackProcess = () => {
    router.dismissAll();
    router.push(`/(professional)/(orders)/${serviceId}`); // Ou a tela de histórico do pedido
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Feather name="check" size={40} color="#10B981" />
        </View>

        <Text style={styles.title}>Serviço concluído!</Text>
        <Text style={styles.subtitle}>
          Você mandou este serviço como finalizado com sucesso.
        </Text>

        {/* Caixa de aviso amarela */}
        <View style={styles.warningBox}>
          <Feather
            name="alert-triangle"
            size={16}
            color="#D97706"
            style={styles.warningIcon}
          />
          <Text style={styles.warningText}>
            O cliente foi notificado e precisa confirmar a conclusão pelo
            aplicativo para finalizar o processo.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleTrackProcess}
        >
          <Text style={styles.primaryBtnText}>Acompanhe o processo</Text>
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
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 16,
  },

  warningBox: {
    flexDirection: "row",
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: 12,
    alignItems: "flex-start",
  },
  warningIcon: { marginTop: 2, marginRight: 12 },
  warningText: { flex: 1, fontSize: 13, color: "#92400E", lineHeight: 20 },

  footer: { padding: 24, gap: 12 },
  primaryBtn: {
    backgroundColor: "#F26F21",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  secondaryBtnText: { color: "#111827", fontSize: 16, fontWeight: "600" },
});
