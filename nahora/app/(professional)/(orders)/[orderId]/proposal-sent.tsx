import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ProposalSentScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        <Text style={styles.title}>
          Interesse enviado com sucesso!
        </Text>

        <Text style={styles.subtitle}>
          O cliente já recebeu sua proposta e poderá entrar em contato pelo chat.
        </Text>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(professional)/(home)")}
        >
          <Text style={styles.buttonText}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 20,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  checkIcon: {
    fontSize: 36,
    color: "#22c55e",
    fontWeight: "700",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 22,
  },
  bottomBar: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  button: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "500",
  },
});
