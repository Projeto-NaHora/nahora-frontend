import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { PaymentTotalCard } from "@/features/payments/components/PaymentTotalCard";
import { PaymentMethodCard } from "@/features/payments/components/PaymentMethodCard";

type MetodoSelecionado = "PIX" | "CARTAO_CREDITO";

export default function PaymentOptionsScreen() {
  const { orderId, valor: valorParam } = useLocalSearchParams<{
    orderId: string;
    valor?: string;
  }>();
  const router = useRouter();
  const pedidoId = Number(orderId);

  // The order's valorAcordado is set when a proposal is accepted —
  // it's the authoritative source, unlike the proposals list which
  // the API clears once a proposal is accepted.
  const { data: pedido, isLoading } = useOrderDetail(pedidoId);

  const valorAcordado = pedido?.valorAcordado ?? 0;
  const parametroValor = Number(valorParam) || 0;
  const valor = valorAcordado || parametroValor;
  const hasAcceptedProposal = valor > 0;

  const [selectedMethod, setSelectedMethod] = useState<MetodoSelecionado>("PIX");

  const handleContinue = () => {
    const pathname =
      selectedMethod === "PIX"
        ? `/(client)/(orders)/${orderId}/payment/pix`
        : `/(client)/(orders)/${orderId}/payment/card`;
    router.push({ pathname, params: { valor: String(valor) } });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Opções de Pagamento</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Total a pagar */}
      <View style={styles.totalSection}>
        {isLoading && !hasAcceptedProposal ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f27b24" />
            <Text style={styles.loadingText}>Carregando valor...</Text>
          </View>
        ) : !hasAcceptedProposal ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Nenhuma proposta aceita para este pedido.
            </Text>
          </View>
        ) : (
          <PaymentTotalCard valor={valor} />
        )}
      </View>

      {/* Escolha como deseja pagar */}
      <View style={styles.optionsSection}>
        <Text style={styles.sectionTitle}>Escolha como deseja pagar</Text>

        <View style={styles.optionGap}>
          <PaymentMethodCard
            title="Pix"
            subtitle="Aprovação imediata"
            badge="RECOMENDADO"
            selected={selectedMethod === "PIX"}
            onPress={() => setSelectedMethod("PIX")}
            icon={<PixIcon />}
          />
        </View>

        <PaymentMethodCard
          title="Cartão de Crédito"
          subtitle="Pagamento processado em até 1 dia útil"
          selected={selectedMethod === "CARTAO_CREDITO"}
          onPress={() => setSelectedMethod("CARTAO_CREDITO")}
          icon={<CardIcon />}
        />
      </View>

      {/* Botão Continuar */}
      <View style={styles.continueSection}>
        <Pressable
          style={[
            styles.continueButton,
            valor === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={valor === 0}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <ShieldIcon />
          <Text style={styles.footerText}>
            Transação segura e criptografada
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function PixIcon() {
  return (
    <View style={styles.pixIconBg}>
      <View style={styles.pixIconInner} />
    </View>
  );
}

function CardIcon() {
  return (
    <View style={styles.cardIconBg}>
      <View style={styles.cardIconInner} />
    </View>
  );
}

function ShieldIcon() {
  return (
    <View style={styles.shieldIcon}>
      <View style={styles.shieldInner}>
        <Text style={styles.shieldCheck}>✓</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: { paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f4f4f5",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { fontSize: 20, color: "#111111" },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1c1c1e",
    textAlign: "center",
    flex: 1,
  },
  headerSpacer: { width: 44 },
  totalSection: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  loadingContainer: { alignItems: "center", paddingVertical: 32 },
  loadingText: { color: "#8c8c8c", fontSize: 14, marginTop: 12 },
  errorContainer: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
    alignItems: "center",
  },
  errorText: { color: "#dc2626", fontSize: 14, textAlign: "center" },
  optionsSection: { paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 16,
  },
  optionGap: { marginBottom: 16 },
  continueSection: { paddingHorizontal: 20, paddingTop: 24 },
  continueButton: {
    backgroundColor: "#f27b24",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  continueButtonDisabled: { opacity: 0.5 },
  footer: { alignItems: "center", paddingTop: 32, opacity: 0.6 },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  footerText: { fontSize: 13, color: "#8c8c8c" },
  pixIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f27b24",
    alignItems: "center",
    justifyContent: "center",
  },
  pixIconInner: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 2,
  },
  cardIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconInner: {
    width: 20,
    height: 14,
    borderWidth: 2,
    borderColor: "#111111",
    borderRadius: 2,
  },
  shieldIcon: { width: 14, height: 14 },
  shieldInner: {
    width: "100%",
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#8c8c8c",
    opacity: 0.6,
    alignItems: "center",
    justifyContent: "center",
  },
  shieldCheck: { fontSize: 8, color: "#ffffff", fontWeight: "bold" },
});
