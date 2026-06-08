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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          disabled={desabilitado}
        >
          <Feather name="arrow-left" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Avaliação</Text>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => router.replace(listRoute)}
          disabled={desabilitado}
        >
          <Feather name="x" size={18} color="#111827" />
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
            <Text style={styles.avatarText}>{iniciais}</Text>
          </View>
          <Text style={styles.nome}>{nomeAvaliado}</Text>
          <Text style={styles.meta}>
            {categoria} · {data}
          </Text>
        </View>

        {/* Estrelas */}
        <View style={styles.starsSection}>
          <Text style={styles.sectionTitle}>Como foi o serviço?</Text>
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
            <Text style={styles.notaLabel}>{labelNota}</Text>
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
                      ? styles.tagChipAtiva
                      : styles.tagChipInativa,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      ativa ? styles.tagTextAtiva : styles.tagTextInativa,
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
            style={styles.commentInput}
            placeholder="Conte mais sobre sua experiência (opcional)"
            placeholderTextColor="#9CA3AF"
            value={comentario}
            onChangeText={setComentario}
            multiline
            maxLength={500}
            textAlignVertical="top"
            editable={!desabilitado}
          />
          <Text style={styles.charCount}>{comentario.length}/500</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, !podeEnviar && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!podeEnviar}
        >
          {submitStatus === "submitting" ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>Enviar Avaliação</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLink}
          onPress={goHome}
          disabled={desabilitado}
        >
          <Text style={styles.backLinkText}>Voltar para o Início</Text>
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
          <View style={styles.modalContent}>
            <View style={[styles.modalIconCircle, styles.modalIconSuccess]}>
              <Feather name="check" size={36} color="#065F46" />
            </View>
            <Text style={styles.modalTitle}>Avaliação enviada!</Text>
            <Text style={styles.modalMessage}>
              Sua avaliação foi registrada com sucesso.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={goHome}
              activeOpacity={0.7}
            >
              <Text style={styles.modalButtonText}>Voltar para o Início</Text>
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
          <View style={styles.modalContent}>
            <View style={[styles.modalIconCircle, styles.modalIconError]}>
              <Feather name="x" size={36} color="#DC2626" />
            </View>
            <Text style={styles.modalTitle}>Ops, algo deu errado!</Text>
            <Text style={styles.modalMessage}>
              Não foi possível enviar sua avaliação. Verifique sua conexão e
              tente novamente.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleRetry}
              activeOpacity={0.7}
            >
              <Text style={styles.modalButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalLink}
              onPress={goHome}
              activeOpacity={0.7}
            >
              <Text style={styles.modalLinkText}>Voltar para o Início</Text>
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
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#EAEAEA",
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
    color: "#E67215",
  },
  nome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: "#8C8C8C",
  },

  // Stars
  starsSection: {
    alignItems: "center",
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
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
    color: "#F27B24",
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
  tagChipAtiva: {
    backgroundColor: "#FFCDB5",
    borderWidth: 1,
    borderColor: "#FEF1EB",
  },
  tagChipInativa: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DEDEDE",
  },
  tagText: {
    fontSize: 14,
    fontWeight: "700",
  },
  tagTextAtiva: {
    color: "#F37021",
  },
  tagTextInativa: {
    color: "#000000",
  },

  // Comment
  commentSection: {
    paddingBottom: 24,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#DEDEDE",
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: "#111827",
    minHeight: 120,
    fontFamily: "Inter",
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },

  // Footer
  footer: {
    padding: 24,
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  submitBtn: {
    backgroundColor: "#F26F21",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: "#FFFFFF",
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
    backgroundColor: "#F26F21",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  modalButtonText: {
    color: "#FFFFFF",
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
    color: "#F97415",
  },
});
