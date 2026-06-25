import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrderDetail } from "@/features/orders/hooks/useOrders";
import { paymentsService } from "@/features/payments/service";
import { PaymentTotalCard } from "@/features/payments/components/PaymentTotalCard";
import {
  CardForm,
  type CardFormValues,
} from "@/features/payments/components/CardForm";

export default function CardPaymentScreen() {
  const { orderId, valor: valorParam } = useLocalSearchParams<{
    orderId: string;
    valor: string;
  }>();
  const router = useRouter();
  const pedidoId = Number(orderId);

  // The order's valorAcordado is the authoritative source after acceptance.
  // Navigation param is fallback (flow from the payment-options screen).
  const { data: pedido, isLoading: isLoadingProposta } = useOrderDetail(pedidoId);
  const valorAcordado = pedido?.valorAcordado ?? 0;
  const parametroValor = Number(valorParam) || 0;
  const valor = valorAcordado || parametroValor;

  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (values: CardFormValues) => {
    setCardError(null);
    setLoading(true);
    try {
      const result = await paymentsService.simular(pedidoId, {
        metodo: "CARTAO_CREDITO",
        parcelas: values.parcelas,
        salvarCartao: values.salvarCartao,
      });

      router.replace({
        pathname: `/(client)/(orders)/${orderId}/payment/receipt`,
        params: {
          orderId: String(orderId),
          pagamentoId: String(result.pagamentoId),
          valor: String(result.valor),
          metodo: result.metodo,
          dataPagamento: result.dataPagamento ?? "",
          codigoTransacao: result.codigoTransacao ?? "",
          prestadorNome: result.prestadorNome ?? "",
        },
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Erro ao processar pagamento";
      setCardError(message);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Pagamento via Cartão</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Total a pagar */}
      <View style={styles.totalSection}>
        {isLoadingProposta && valor === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando valor...</Text>
          </View>
        ) : (
          <PaymentTotalCard valor={valor} />
        )}
      </View>

      {/* Formulário */}
      <View style={styles.formSection}>
        {cardError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{cardError}</Text>
          </View>
        )}

        <CardForm valor={valor} loading={loading} onSubmit={handleSubmit} />

        {/* Footer segura */}
        <View style={styles.secureFooter}>
          <View style={styles.secureRow}>
            <View style={styles.secureIcon}>
              <Text style={styles.secureCheck}>✓</Text>
            </View>
            <Text style={styles.secureText}>Pagamento 100% seguro</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
  formSection: { paddingHorizontal: 20, flex: 1 },
  errorBanner: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  errorBannerText: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
  },
  secureFooter: {
    alignItems: "center",
    marginTop: 32,
    opacity: 0.6,
  },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  secureIcon: {
    width: 14,
    height: 14,
    borderRadius: 2,
    backgroundColor: "#8c8c8c",
    alignItems: "center",
    justifyContent: "center",
  },
  secureCheck: {
    fontSize: 8,
    color: "#ffffff",
    fontWeight: "bold",
  },
  secureText: {
    fontSize: 13,
    color: "#8c8c8c",
  },
});
