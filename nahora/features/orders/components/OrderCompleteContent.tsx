import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { CATEGORIA_LABEL, Pedido } from "../types";

type Props = {
  pedido: Pedido | any;
  isLoading: boolean;
  error: any;
  onBack: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
  onDispute: () => void;
};

// Função auxiliar para pegar iniciais com segurança
const getInitials = (name: string) => {
  if (!name) return "PR";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const OrderCompleteContent: React.FC<Props> = ({
  pedido,
  isLoading,
  error,
  onBack,
  onConfirm,
  isConfirming,
  onDispute,
}) => {
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F26F21" />
      </SafeAreaView>
    );
  }

  if (error || !pedido) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Erro ao carregar os dados.</Text>
        <TouchableOpacity style={styles.backBtnFallback} onPress={onBack}>
          <Text style={styles.backBtnFallbackText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Extração segura de dados
  // Obs: Adapte "profissionalNome" para a chave correta que o seu backend envia
  const nomeProfissional = pedido.profissionalNome || "Profissional";
  const categoriaFormatada =
    CATEGORIA_LABEL[pedido.categoria] || pedido.categoria || "Serviço";
  const dataFormatada = pedido.dataDesejada
    ? new Date(pedido.dataDesejada).toLocaleDateString("pt-BR")
    : "";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          disabled={isConfirming}
        >
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmar conclusão</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Ícone de Sucesso Central */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Feather name="check" size={32} color="#065F46" />
          </View>
        </View>

        {/* Textos Principais */}
        <Text style={styles.title}>Serviço concluído?</Text>
        <Text style={styles.subtitle}>
          <Text style={{ fontWeight: "700", color: "#374151" }}>
            {nomeProfissional}
          </Text>{" "}
          marcou o serviço como concluído. Confirme para liberar o pagamento e a
          avaliação.
        </Text>

        {/* Card do Profissional */}
        <View style={styles.providerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(nomeProfissional)}
            </Text>
          </View>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{nomeProfissional}</Text>
            <Text style={styles.providerDetails}>
              {categoriaFormatada} {dataFormatada ? `• ${dataFormatada}` : ""}
            </Text>
          </View>
        </View>
      </View>

      {/* Botões de Ação na base */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            isConfirming && styles.primaryButtonDisabled,
          ]}
          onPress={onConfirm}
          disabled={isConfirming}
        >
          {isConfirming ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Confirmar conclusão</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onDispute}
          disabled={isConfirming}
        >
          <Text style={styles.secondaryButtonText}>Contestar conclusão</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  iconWrapper: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E6F4EA",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 16,
    padding: 16,
    width: "100%",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEF0E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#F26F21",
    fontWeight: "700",
    fontSize: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  providerDetails: {
    fontSize: 13,
    color: "#6B7280",
  },
  footer: {
    padding: 24,
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  primaryButton: {
    backgroundColor: "#F26F21",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#FDE8E8",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 16,
    marginBottom: 16,
  },
  backBtnFallback: {
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  backBtnFallbackText: {
    color: "#374151",
    fontWeight: "600",
  },
});
