import React, { useEffect } from "react";
import { View,
  Text,
  StyleSheet,BackHandler, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { mutate } from "swr";
import { ordersKeys } from "@/features/orders/types";

export default function IssueSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const goHome = () => {
    const id = Number(orderId);
    mutate(ordersKeys.detail(id));
    router.dismissAll();
    router.replace("/(client)/(home)");
  };

  // Bloqueia o botão físico de voltar do Android para não reabrir o formulário
  useEffect(() => {
    const onBackPress = () => {
      const id = Number(orderId);
      mutate(ordersKeys.detail(id));
      router.dismissAll();
      router.replace("/(client)/(home)");
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => subscription.remove();
  }, [router]);

  const handleTrackAnalysis = () => {
    // Leva para a tela C103 (Análise da Disputa)
    router.push(`/(client)/(orders)/${orderId}/issue/analysis`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Pressable style={styles.closeBtn} onPress={goHome}>
          <Feather name="x" size={24} color="#111827" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Feather name="check" size={40} color="#10B981" />
        </View>

        <Text style={styles.title}>Problema reportado{"\n"}com sucesso!</Text>
        <Text style={styles.subtitle}>
          Recebemos sua denúncia e as evidências.
        </Text>

        {/* Box do Protocolo */}
        <View style={styles.protocolBox}>
          <View style={styles.protocolRow}>
            <Text style={styles.protocolLabel}>Número da Disputa</Text>
            <Text style={styles.protocolValue}>#DIS-2026-04789</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Feather
              name="clock"
              size={16}
              color="#3B82F6"
              style={{ marginTop: 2 }}
            />
            <Text style={styles.infoText}>
              Nossa equipe de moderação avaliará o caso e dará um retorno em até
              48 horas.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.primaryBtn}
          onPress={handleTrackAnalysis}
        >
          <Text style={styles.primaryBtnText}>Acompanhar análise</Text>
          <Feather
            name="arrow-right"
            size={18}
            color="#FFFFFF"
            style={{ marginLeft: 8 }}
          />
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={goHome}>
          <Text style={styles.secondaryBtnText}>Voltar ao início</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

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
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
  },

  protocolBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  protocolRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  protocolLabel: { fontSize: 13, color: "#6B7280" },
  protocolValue: { fontSize: 14, fontWeight: "700", color: "#111827" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 16 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  infoText: { flex: 1, fontSize: 13, color: "#4B5563", lineHeight: 20 },

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
    backgroundColor: "#F9FAFB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  secondaryBtnText: { color: "#111827", fontSize: 16, fontWeight: "600" },
});
