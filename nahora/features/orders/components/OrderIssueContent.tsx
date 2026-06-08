import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pedido, CATEGORIA_LABEL } from "../types";

// Função para pegar as iniciais do profissional
const getInitials = (name: string) => {
  if (!name) return "PR";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase();
};

type Props = {
  pedido: Pedido | any;
  isLoading: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (motivo: string, descricao: string) => void;
};

export const OrderIssueContent: React.FC<Props> = ({
  pedido,
  isLoading,
  isSubmitting,
  onBack,
  onSubmit,
}) => {
  const [motivo, setMotivo] = useState(
    "Serviço não foi executado conforme combinado",
  );
  const [descricao, setDescricao] = useState("");

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#EF4444" />
      </SafeAreaView>
    );
  }

  const profissionalNome = pedido?.profissionalAtribuidoNome || "Profissional";
  const categoriaFormatada =
    CATEGORIA_LABEL[pedido?.categoria] || pedido?.categoria || "Serviço";
  const dataFormatada = pedido?.dataDesejada
    ? new Date(pedido.dataDesejada).toLocaleDateString("pt-BR")
    : "";
  const valorParaExibir = pedido?.valorAcordado ?? pedido?.orcamentoEstimado ?? 0;
  const valorFormatado = Number(valorParaExibir).toLocaleString(
    "pt-BR",
    { style: "currency", currency: "BRL" },
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Fixo */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          disabled={isSubmitting}
        >
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tive um problema</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Ícone de Alerta Central */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Text style={styles.exclamationMark}>!</Text>
          </View>
        </View>

        <Text style={styles.mainTitle}>O serviço não foi concluído?</Text>
        <Text style={styles.subtitle}>
          Ao reportar um problema, o pagamento ficará retido até que a situação
          seja resolvida pela nossa equipe.
        </Text>

        {/* Card do Profissional */}
        <View style={styles.providerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(profissionalNome)}
            </Text>
          </View>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{profissionalNome}</Text>
            <Text style={styles.providerDetails}>
              {categoriaFormatada} {dataFormatada ? `• ${dataFormatada}` : ""}
            </Text>
            <Text style={styles.providerPrice}>{valorFormatado}</Text>
          </View>
        </View>

        {/* Formulário: Motivo */}
        <Text style={styles.inputLabel}>Qual o motivo do problema?</Text>
        <TouchableOpacity style={styles.dropdownButton}>
          <Text style={styles.dropdownText}>{motivo}</Text>
          <Feather name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>

        {/* Formulário: Descrição */}
        <Text style={styles.inputLabel}>Descreva o que aconteceu</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Ex: O profissional realizou apenas parte do serviço e foi embora sem avisar..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          maxLength={500}
          value={descricao}
          onChangeText={setDescricao}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>
          Quanto mais detalhes, mais rápida a análise. Máx. 500 caracteres.
        </Text>

        {/* Evidências (Mock Visual) */}
        <Text style={styles.inputLabel}>Evidências (fotos / prints)</Text>
        <View style={styles.evidenceContainer}>
          <TouchableOpacity style={styles.evidenceButton}>
            <Feather
              name="camera"
              size={20}
              color="#6B7280"
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.evidenceText}>Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.evidenceButton}>
            <Feather
              name="paperclip"
              size={20}
              color="#6B7280"
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.evidenceText}>Arquivo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.evidenceButton}>
            <Feather
              name="image"
              size={20}
              color="#F9A8D4"
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.evidenceText}>Galeria</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Actions (Movi para cá, dentro do ScrollView) */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onBack}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.continueButton, isSubmitting && { opacity: 0.7 }]}
            onPress={() => onSubmit(motivo, descricao)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#EF4444" />
            ) : (
              <>
                <Text style={styles.continueButtonText}>Continuar</Text>
                <Feather
                  name="arrow-right"
                  size={18}
                  color="#EF4444"
                  style={{ marginLeft: 8 }}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
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
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  scrollContent: { flex: 1 },
  scrollInner: { padding: 24, paddingBottom: 48 },

  iconWrapper: { alignItems: "center", marginBottom: 24 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FCE8E8",
    alignItems: "center",
    justifyContent: "center",
  },
  exclamationMark: { fontSize: 28, color: "#111827", fontWeight: "300" },

  mainTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },

  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF7F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: { color: "#F26F21", fontWeight: "700", fontSize: 16 },
  providerInfo: { flex: 1 },
  providerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  providerDetails: { fontSize: 12, color: "#9CA3AF", marginBottom: 4 },
  providerPrice: { fontSize: 14, fontWeight: "700", color: "#10B981" },

  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  dropdownText: { fontSize: 14, color: "#111827" },

  textArea: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    height: 120,
    fontSize: 14,
    color: "#111827",
    marginBottom: 8,
  },
  charCount: { fontSize: 11, color: "#9CA3AF", marginBottom: 24 },

  evidenceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  evidenceButton: {
    flex: 1,
    height: 90,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  evidenceText: { fontSize: 12, color: "#6B7280" },

  footer: {
    flexDirection: "row",
    marginTop: 40, // Espaçamento extra das caixas de evidência
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: { color: "#111827", fontSize: 15, fontWeight: "700" },
  continueButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FEE2E2",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: { color: "#EF4444", fontSize: 15, fontWeight: "700" },
});
