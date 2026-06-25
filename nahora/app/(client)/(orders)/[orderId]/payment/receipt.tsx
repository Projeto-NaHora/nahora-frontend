import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Share,
  Alert,
  Platform,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ReceiptCard } from "@/features/payments/components/ReceiptCard";
import { paymentsService } from "@/features/payments/service";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let base64 = "";
  for (let i = 0; i < binary.length; i += 3) {
    const a = binary.charCodeAt(i);
    const b = binary.charCodeAt(i + 1);
    const c = binary.charCodeAt(i + 2);
    const enc1 = a >> 2;
    const enc2 = ((a & 3) << 4) | (b >> 4);
    const enc3 = ((b & 15) << 2) | (c >> 6);
    const enc4 = c & 63;
    base64 += chars[enc1] + chars[enc2];
    base64 += b ? chars[enc3] : "=";
    base64 += c ? chars[enc4] : "=";
  }
  return base64;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function ReceiptScreen() {
  const params = useLocalSearchParams<{
    orderId?: string;
    pagamentoId: string;
    valor: string;
    metodo: string;
    dataPagamento: string;
    codigoTransacao: string;
    prestadorNome?: string;
  }>();
  const router = useRouter();
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const valor = Number(params.valor) || 0;
  const metodo = params.metodo ?? "PIX";
  const orderId = params.orderId ? Number(params.orderId) : null;

  const handleShare = async () => {
    const formattedValor = currencyFormatter.format(valor);

    const methodLabel = metodo === "PIX" ? "Pix" : "Cartão de Crédito";

    try {
      await Share.share({
        message: `Pagamento realizado com sucesso!\n\nValor: ${formattedValor}\nMétodo: ${methodLabel}\nData: ${params.dataPagamento ?? "—"}\nTransação: ${params.codigoTransacao ?? "—"}\n\n— NaHora!`,
      });
    } catch {
      // Usuário cancelou
    }
  };

  const handleDownloadPdf = async () => {
    if (!orderId) {
      Alert.alert("Erro", "Pedido não identificado para gerar recibo.");
      return;
    }

    setDownloadingPdf(true);
    try {
      const pdfBytes = await paymentsService.baixarRecibo(orderId);
      const base64 = arrayBufferToBase64(pdfBytes);
      const pdfUri = `data:application/pdf;base64,${base64}`;

      await Share.share({
        url: Platform.OS === "ios" ? pdfUri : undefined,
        message: Platform.OS === "android" ? pdfUri : undefined,
      });
    } catch (err: any) {
      if (err?.message !== "User did not share") {
        Alert.alert("Erro", "Não foi possível baixar o recibo.");
      }
    }
    setDownloadingPdf(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <View style={styles.headerCenter} />
        <Pressable
          onPress={() => router.replace("/(client)/(home)")}
          style={styles.closeButton}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
      </View>

      {/* Success section */}
      <View style={styles.successSection}>
        <View style={styles.successIconBg}>
          <View style={styles.checkmark} />
        </View>
        <Text style={styles.successTitle}>Pagamento Realizado!</Text>
        <Text style={styles.successDesc}>
          O pagamento foi confirmado e o{"\n"}
          prestador já foi notificado.
        </Text>
      </View>

      {/* Receipt card */}
      <View style={styles.receiptSection}>
        <ReceiptCard
          valor={valor}
          dataPagamento={params.dataPagamento || null}
          metodo={metodo}
          codigoTransacao={params.codigoTransacao || null}
        />
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <Pressable onPress={handleShare} style={styles.actionButton}>
          <Text style={styles.actionText}>Compartilhar</Text>
        </Pressable>
        <Pressable
          onPress={handleDownloadPdf}
          disabled={downloadingPdf}
          style={[
            styles.actionButton,
            downloadingPdf && styles.actionButtonDisabled,
          ]}
        >
          <Text style={styles.actionText}>
            {downloadingPdf ? "Baixando..." : "Baixar PDF"}
          </Text>
        </Pressable>
      </View>

      {/* Home link */}
      <View style={styles.homeLink}>
        <Pressable onPress={() => router.replace("/(client)/(home)")}>
          <Text style={styles.homeLinkText}>Voltar para o Início</Text>
        </Pressable>
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
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 16,
  },
  headerLeft: { width: 40 },
  headerCenter: { flex: 1 },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#eaeaea",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: { fontSize: 16, color: "#111111" },
  successSection: { alignItems: "center", paddingTop: 16, paddingBottom: 24 },
  successIconBg: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#e3f5e7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  checkmark: {
    width: 27,
    height: 18,
    borderLeftWidth: 3.3,
    borderBottomWidth: 3.3,
    borderColor: "#1f9945",
    transform: [{ rotate: "-45deg" }],
    marginTop: -4,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 8,
    textAlign: "center",
  },
  successDesc: {
    fontSize: 15,
    color: "#8c8c8c",
    textAlign: "center",
    paddingHorizontal: 36,
    lineHeight: 24.38,
  },
  receiptSection: { paddingHorizontal: 20, marginBottom: 24 },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#fff2e5",
    borderRadius: 16,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonDisabled: { opacity: 0.6 },
  actionText: { fontSize: 14, fontWeight: "bold", color: "#f27b24" },
  homeLink: { alignItems: "center" },
  homeLinkText: { fontSize: 16, fontWeight: "bold", color: "#F97415" },
});
