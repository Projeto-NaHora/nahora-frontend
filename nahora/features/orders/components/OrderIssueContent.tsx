import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
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
  motivosDisponiveis: string[];
  onBack: () => void;
  onSubmit: (motivo: string, descricao: string, fotosUris: string[]) => void;
};

export const OrderIssueContent: React.FC<Props> = ({
  pedido,
  isLoading,
  isSubmitting,
  motivosDisponiveis,
  onBack,
  onSubmit,
}) => {
  const [motivo, setMotivo] = useState(motivosDisponiveis[0]);
  const [descricao, setDescricao] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);

  // Abrir a Câmera
  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permissão negada",
        "É necessário permitir o acesso à câmera.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  // Abrir a Galeria
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  // Remover foto da lista
  const handleRemovePhoto = (indexToRemove: number) => {
    setFotos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

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
          <View style={[styles.iconCircle, { backgroundColor: colors.surfaceRed }]}>
            <Text style={[styles.exclamationMark, { color: colors.error }]}>!</Text>
          </View>
        </View>

        <Text style={[styles.mainTitle, { color: colors.text }]}>O serviço não foi concluído?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Ao reportar um problema, o pagamento ficará retido até que a situação
          seja resolvida pela nossa equipe.
        </Text>

        {/* Card do Profissional */}
        <View style={[styles.providerCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.surfaceAccent }]}>
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

        {/* Formulário: Motivo (Seletor Real) */}
        <Text style={[styles.inputLabel, { color: colors.text }]}>Qual o motivo do problema?</Text>
        <View style={styles.optionsContainer}>
          {motivosDisponiveis.map((item) => {
            const isSelected = motivo === item;
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.optionCard,
                  { backgroundColor: colors.surfaceGray, borderColor: colors.border },
                  isSelected && { borderColor: colors.error, backgroundColor: colors.surfaceRed },
                ]}
                onPress={() => setMotivo(item)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    { borderColor: colors.border },
                    isSelected && { borderColor: colors.error },
                  ]}
                >
                  {isSelected && <View style={[styles.radioInner, { backgroundColor: colors.error }]} />}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    { color: colors.textSecondary },
                    isSelected && { color: colors.text },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Formulário: Descrição */}
        <Text style={[styles.inputLabel, { color: colors.text }]}>Descreva o que aconteceu</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Ex: O profissional realizou apenas parte do serviço e foi embora sem avisar..."
          placeholderTextColor={colors.placeholder}
          multiline
          numberOfLines={4}
          maxLength={500}
          value={descricao}
          onChangeText={setDescricao}
          textAlignVertical="top"
        />
        <Text style={[styles.charCount, { color: colors.textSecondary }]}>
          Quanto mais detalhes, mais rápida a análise. Máx. 500 caracteres.
        </Text>

        {/* Evidências */}
        <Text style={[styles.inputLabel, { color: colors.text }]}>Evidências (fotos / prints)</Text>

        {/* Lista de miniaturas das fotos escolhidas */}
        {fotos.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photosList}
          >
            {fotos.map((uri, index) => (
              <View key={index} style={styles.photoThumbnailContainer}>
                <Image source={{ uri }} style={styles.photoThumbnail} />
                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={() => handleRemovePhoto(index)}
                >
                  <Feather name="x" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Botões para adicionar mais fotos */}
        <View style={styles.evidenceContainer}>
          <TouchableOpacity
            style={[styles.evidenceButton, { borderColor: colors.border }]}
            onPress={handleTakePhoto}
          >
            <Feather
              name="camera"
              size={20}
              color={colors.icon}
              style={{ marginBottom: 8 }}
            />
            <Text style={[styles.evidenceText, { color: colors.textSecondary }]}>Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.evidenceButton, { borderColor: colors.border }]}
            onPress={handlePickImage}
          >
            <Feather
              name="image"
              size={20}
              color={colors.icon}
              style={{ marginBottom: 8 }}
            />
            <Text style={[styles.evidenceText, { color: colors.textSecondary }]}>Galeria</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.surface }]}
            onPress={onBack}
            disabled={isSubmitting}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: colors.surface },
              (isSubmitting || descricao.trim().length < 10) && {
                opacity: 0.5,
              },
            ]}
            onPress={() => onSubmit(motivo, descricao, fotos)}
            disabled={isSubmitting || descricao.trim().length < 10}
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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

  // Novos estilos do seletor
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 15,
    flex: 1,
  },

  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    height: 120,
    fontSize: 14,
    marginBottom: 8,
  },
  charCount: { fontSize: 11, marginBottom: 24 },

  photosList: { marginBottom: 16 },
  photoThumbnailContainer: { position: "relative", marginRight: 12 },
  photoThumbnail: { width: 80, height: 80, borderRadius: 12 },
  removePhotoBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#EF4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

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

  footer: { flexDirection: "row", marginTop: 40, gap: 16 },
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
