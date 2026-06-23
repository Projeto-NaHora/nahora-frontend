import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import type { TagAvaliacao } from "@/types/enums";
import {
  TAGS_PARA_CLIENTE,
  TAGS_PARA_PROFISSIONAL,
  TAG_LABEL,
  NOTA_LABEL,
} from "../types";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

type PapelAvaliacao = "CLIENTE" | "PROFISSIONAL";
type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface RatingFormProps {
  /** Nome da pessoa sendo avaliada */
  nomeAvaliado: string;
  /** Iniciais para o avatar */
  iniciais: string;
  /** Nome da categoria do serviço */
  categoria: string;
  /** Data do serviço formatada */
  data: string;
  /** Quem está avaliando — define quais tags aparecem */
  papel: PapelAvaliacao;
  /** Chamado ao submeter */
  onSubmit: (data: {
    nota: number;
    comentario: string;
    tags: TagAvaliacao[];
  }) => Promise<void>;
}

const STARS = [1, 2, 3, 4, 5];

export function RatingForm({
  nomeAvaliado,
  iniciais,
  categoria,
  data,
  papel,
  onSubmit,
}: RatingFormProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const router = useRouter();
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [tagsSelecionadas, setTagsSelecionadas] = useState<TagAvaliacao[]>([]);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const tagsDisponiveis =
    papel === "PROFISSIONAL" ? TAGS_PARA_CLIENTE : TAGS_PARA_PROFISSIONAL;

  const homeRoute =
    papel === "PROFISSIONAL"
      ? "/(professional)/(home)"
      : "/(client)/(home)";

  const listRoute =
    papel === "PROFISSIONAL"
      ? "/(professional)/(services)"
      : "/(client)/(orders)";

  const goHome = useCallback(() => {
    router.replace(homeRoute);
  }, [router, homeRoute]);

  const toggleTag = useCallback((tag: TagAvaliacao) => {
    setTagsSelecionadas((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag],
    );
  }, []);

  const handleSubmit = async () => {
    if (nota === 0 || submitStatus === "submitting") return;
    setSubmitStatus("submitting");
    try {
      await onSubmit({ nota, comentario, tags: tagsSelecionadas });
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  };

  const handleRetry = () => {
    setSubmitStatus("idle");
  };

  const desabilitado = submitStatus === "submitting";
  const podeEnviar = nota > 0 && submitStatus === "idle";
  const labelNota = nota > 0 ? NOTA_LABEL[nota] : "";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={() => router.back()}
          disabled={desabilitado}
        >
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Avaliação</Text>
        <TouchableOpacity
          style={[styles.menuBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.replace(listRoute)}
          disabled={desabilitado}
        >
          <Feather name="x" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar + Nome */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={[styles.avatarText, { color: colors.brand }]}>{iniciais}</Text>
          </View>
          <Text style={[styles.nome, { color: colors.text }]}>{nomeAvaliado}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            {categoria} · {data}
          </Text>
        </View>

        {/* Estrelas */}
        <View style={styles.starsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Como foi o serviço?</Text>
          <View style={styles.starsRow}>
            {STARS.map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setNota(star)}
                activeOpacity={0.6}
                disabled={desabilitado}
              >
                <MaterialCommunityIcons
                  name={star <= nota ? "star" : "star-outline"}
                  size={32}
                  color={star <= nota ? "#F59E0B" : "#D1D5DB"}
                />
              </TouchableOpacity>
            ))}
          </View>
          {labelNota ? (
            <Text style={[styles.notaLabel, { color: colors.brand }]}>{labelNota}</Text>
          ) : null}
        </View>

        {/* Tags */}
        <View style={styles.tagsSection}>
          <View style={styles.tagsRow}>
            {tagsDisponiveis.map((tag) => {
              const ativa = tagsSelecionadas.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  activeOpacity={0.7}
                  disabled={desabilitado}
                  style={[
                    styles.tagChip,
                    ativa
                      ? { backgroundColor: colors.brand, borderColor: colors.brand }
                      : { backgroundColor: colors.background, borderColor: colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      ativa ? { color: colors.onBrand } : { color: colors.text },
                    ]}
                  >
                    {TAG_LABEL[tag]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Comentário */}
        <View style={styles.commentSection}>
          <TextInput
            style={[styles.commentInput, { borderColor: colors.border, color: colors.text }]}
            placeholder="Conte mais sobre sua experiência (opcional)"
            placeholderTextColor={colors.placeholder}
            value={comentario}
            onChangeText={setComentario}
            multiline
            maxLength={500}
            textAlignVertical="top"
            editable={!desabilitado}
          />
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>{comentario.length}/500</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.brand }, !podeEnviar && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!podeEnviar}
        >
          {submitStatus === "submitting" ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.submitBtnText, { color: colors.onBrand }]}>Enviar Avaliação</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLink}
          onPress={goHome}
          disabled={desabilitado}
        >
          <Text style={[styles.backLinkText, { color: colors.brand }]}>Voltar para o Início</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Sucesso */}
      <Modal
        visible={submitStatus === "success"}
        transparent
        animationType="fade"
        onRequestClose={goHome}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={[styles.modalIconCircle, styles.modalIconSuccess]}>
              <Feather name="check" size={36} color="#065F46" />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Avaliação enviada!</Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
              Sua avaliação foi registrada com sucesso.
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.brand }]}
              onPress={goHome}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalButtonText, { color: colors.onBrand }]}>Voltar para o Início</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Erro */}
      <Modal
        visible={submitStatus === "error"}
        transparent
        animationType="fade"
        onRequestClose={handleRetry}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={[styles.modalIconCircle, styles.modalIconError]}>
              <Feather name="x" size={36} color="#DC2626" />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Ops, algo deu errado!</Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
              Não foi possível enviar sua avaliação. Verifique sua conexão e
              tente novamente.
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.brand }]}
              onPress={handleRetry}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalButtonText, { color: colors.onBrand }]}>Tentar novamente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalLink}
              onPress={goHome}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalLinkText, { color: colors.brand }]}>Voltar para o Início</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
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
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  // Profile
  profileSection: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 24,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#FFF2E5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
  },
  nome: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
  },

  // Stars
  starsSection: {
    alignItems: "center",
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  notaLabel: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },

  // Tags
  tagsSection: {
    paddingBottom: 24,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    borderRadius: 23,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tagChip: {
    borderRadius: 23,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Comment
  commentSection: {
    paddingBottom: 24,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    minHeight: 120,
    fontFamily: "Inter",
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    marginTop: 4,
  },

  // Footer
  footer: {
    padding: 24,
    gap: 12,
  },
  submitBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  backLink: {
    alignItems: "center",
    paddingVertical: 8,
  },
  backLinkText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F97415",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
  },
  modalIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalIconSuccess: {
    backgroundColor: "#D1FAE5",
  },
  modalIconError: {
    backgroundColor: "#FEE2E2",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  modalLink: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4,
  },
  modalLinkText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
