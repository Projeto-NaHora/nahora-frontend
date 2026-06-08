import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProposalsByPedido } from "@/features/proposals/hooks/useProposals";
import { paymentsService } from "@/features/payments/service";
import { PaymentTotalCard } from "@/features/payments/components/PaymentTotalCard";
import { PixQrCodeCard } from "@/features/payments/components/PixQrCodeCard";

/** Código copia-e-cola fake para simulação */
const FAKE_PIX_COPIA_COLA =
  "00020126580014br.gov.bcb.pix0136a05e1b70-df6e-4cd1-a4c9-2b1c8c1e5f025204000053039865802BR5925NaHora Servicos Ltda6009SAO PAULO62070503***6304E2CA";

export default function PixPaymentScreen() {
  const { orderId, valor: valorParam } = useLocalSearchParams<{
    orderId: string;
    valor: string;
  }>();
  const router = useRouter();
  const pedidoId = Number(orderId);

  // Obtém o valor da proposta aceita (fonte primária); param é fallback
  const { proposals, isLoading: isLoadingProposta } =
    useProposalsByPedido(pedidoId);
  const acceptedProposal = useMemo(
    () => proposals?.find((p) => p.status === "ACEITA") ?? null,
    [proposals],
  );
  const valor = acceptedProposal?.valor ?? (Number(valorParam) || 0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimularPagamento = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await paymentsService.simular(pedidoId, {
        metodo: "PIX",
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
        "Erro ao simular pagamento";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Pagamento via Pix</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Total a pagar */}
      <View style={styles.totalSection}>
        {isLoadingProposta && !acceptedProposal ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f27b24" />
            <Text style={styles.loadingText}>Carregando valor...</Text>
          </View>
        ) : (
          <PaymentTotalCard valor={valor} />
        )}
      </View>

      {/* QR Code + Copia e Cola (simulado) */}
      <View style={styles.pixSection}>
        <PixQrCodeCard
          qrCodeBase64=""
          copiaCola={FAKE_PIX_COPIA_COLA}
          valor={valor}
        />
      </View>

      {/* Botão Simular pagamento */}
      <View style={styles.simulateSection}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable
          onPress={handleSimularPagamento}
          disabled={loading}
          style={[styles.simulateButton, loading && styles.simulateButtonDisabled]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.simulateButtonText}>Simular pagamento</Text>
          )}
        </Pressable>
      </View>

      {/* Footer info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Pagamento simulado — o pedido será{"\n"}
          confirmado automaticamente.
        </Text>
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
  pixSection: { paddingHorizontal: 20, marginBottom: 24 },
  simulateSection: { paddingHorizontal: 20 },
  errorContainer: { alignItems: "center", paddingBottom: 16 },
  errorText: { color: "#ef4444", fontSize: 16, textAlign: "center" },
  simulateButton: {
    backgroundColor: "#f27b24",
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  simulateButtonDisabled: { opacity: 0.6 },
  simulateButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: { paddingHorizontal: 64, marginTop: 32, alignItems: "center" },
  footerText: {
    fontSize: 13,
    color: "#8c8c8c",
    textAlign: "center",
    lineHeight: 21.13,
  },
});
