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
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

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
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={onBack}
          disabled={isConfirming}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Confirmar conclusão</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Ícone de Sucesso Central */}
        <View style={styles.iconWrapper}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
            <Feather name="check" size={32} color="#065F46" />
          </View>
        </View>

        {/* Textos Principais */}
        <Text style={[styles.title, { color: colors.text }]}>Serviço concluído?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          <Text style={{ fontWeight: "700", color: colors.text }}>
            {nomeProfissional}
          </Text>{" "}
          marcou o serviço como concluído. Confirme para liberar o pagamento e a
          avaliação.
        </Text>

        {/* Card do Profissional */}
        <View style={[styles.providerCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.surfaceAccent }]}>
            <Text style={styles.avatarText}>
              {getInitials(nomeProfissional)}
            </Text>
          </View>
          <View style={styles.providerInfo}>
            <Text style={[styles.providerName, { color: colors.text }]}>{nomeProfissional}</Text>
            <Text style={[styles.providerDetails, { color: colors.textSecondary }]}>
              {categoriaFormatada} {dataFormatada ? `• ${dataFormatada}` : ""}
            </Text>
          </View>
        </View>
      </View>

      {/* Botões de Ação na base */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: colors.brand },
            isConfirming && styles.primaryButtonDisabled,
          ]}
          onPress={onConfirm}
          disabled={isConfirming}
        >
          {isConfirming ? (
            <ActivityIndicator color={colors.onBrand} />
          ) : (
            <Text style={[styles.primaryButtonText, { color: colors.onBrand }]}>Confirmar conclusão</Text>
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
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
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
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
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
    marginBottom: 4,
  },
  providerDetails: {
    fontSize: 13,
  },
  footer: {
    padding: 24,
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
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
    borderRadius: 8,
  },
  backBtnFallbackText: {
    fontWeight: "600",
  },
});
