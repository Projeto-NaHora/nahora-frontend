import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function ProposalSentScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.checkCircle, { backgroundColor: colors.success + "1A" }]}>
          <Text style={[styles.checkIcon, { color: colors.success }]}>✓</Text>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Interesse enviado com sucesso!
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          O cliente já recebeu sua proposta e poderá entrar em contato pelo chat.
        </Text>
      </View>

      <View style={[styles.bottomBar, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.button, { borderColor: colors.border }]}
          onPress={() => router.replace("/(professional)/(home)")}
        >
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  checkIcon: {
    fontSize: 36,
    fontWeight: "700",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  bottomBar: {
    padding: 24,
    borderTopWidth: 1,
  },
  button: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
