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
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

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

  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.error} />
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Fixo */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={onBack}
          disabled={isSubmitting}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Tive um problema</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Ícone de Alerta Central */}
        <View style={styles.iconWrapper}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
            <Text style={styles.exclamationMark}>!</Text>
          </View>
        </View>

        <Text style={[styles.mainTitle, { color: colors.text }]}>O serviço não foi concluído?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Ao reportar um problema, o pagamento ficará retido até que a situação
          seja resolvida pela nossa equipe.
        </Text>

        {/* Card do Profissional */}
        <View style={[styles.providerCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(profissionalNome)}
            </Text>
          </View>
          <View style={styles.providerInfo}>
            <Text style={[styles.providerName, { color: colors.text }]}>{profissionalNome}</Text>
            <Text style={[styles.providerDetails, { color: colors.textSecondary }]}>
              {categoriaFormatada} {dataFormatada ? `• ${dataFormatada}` : ""}
            </Text>
            <Text style={[styles.providerPrice, { color: colors.success }]}>{valorFormatado}</Text>
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
          <TouchableOpacity style={[styles.evidenceButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Feather
              name="camera"
              size={20}
              color={colors.icon}
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.evidenceText}>Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.evidenceButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Feather
              name="paperclip"
              size={20}
              color={colors.icon}
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.evidenceText}>Arquivo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.evidenceButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Feather
              name="image"
              size={20}
              color={colors.icon}
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.evidenceText}>Galeria</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Actions (Movi para cá, dentro do ScrollView) */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.surface }]}
            onPress={onBack}
            disabled={isSubmitting}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: colors.surface }, isSubmitting && { opacity: 0.7 }]}
            onPress={() => onSubmit(motivo, descricao)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.brand} />
            ) : (
              <>
                <Text style={[styles.continueButtonText, { color: colors.brand }]}>Continuar</Text>
                <Feather
                  name="arrow-right"
                  size={18}
                  color={colors.brand}
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
  container: { flex: 1 },
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
  headerTitle: { fontSize: 18, fontWeight: "700" },
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
  exclamationMark: { fontSize: 28, fontWeight: "300" },

  mainTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
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
    marginBottom: 2,
  },
  providerDetails: { fontSize: 12, marginBottom: 4 },
  providerPrice: { fontSize: 14, fontWeight: "700" },

  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
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
  dropdownText: { fontSize: 14 },

  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    height: 120,
    fontSize: 14,
    marginBottom: 8,
  },
  charCount: { fontSize: 11, marginBottom: 24 },

  evidenceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  evidenceButton: {
    flex: 1,
    height: 90,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  evidenceText: { fontSize: 12 },

  footer: {
    flexDirection: "row",
    marginTop: 40, // Espaçamento extra das caixas de evidência
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: { fontSize: 15, fontWeight: "700" },
  continueButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: { fontSize: 15, fontWeight: "700" },
});
