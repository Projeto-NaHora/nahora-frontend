import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProposalDetail, useProposalActions } from "@/features/proposals/hooks/useProposals";
import { getInitials } from "@/utils/formatters";

export default function DetalhePropostaScreen() {
  const { orderId, proposalId } = useLocalSearchParams<{ orderId: string; proposalId: string; }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { proposal, isLoading, isError } = useProposalDetail(Number(proposalId));
  const { acceptProposal, rejectProposal } = useProposalActions(() => {
    router.replace(`/(client)/(orders)/${orderId}/active`);
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (isError || !proposal) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar proposta.</Text>
      </View>
    );
  }

  const handleAceitar = () => {
    Alert.alert(
      "Aceitar proposta",
      `Deseja aceitar a proposta de ${proposal.profissional.nome} por R$ ${proposal.valor.toFixed(2)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            setLoading(true);
            try {
              await acceptProposal(proposal.id);
            } catch {
              Alert.alert("Erro", "Não foi possível aceitar a proposta.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRecusar = async () => {
    Alert.alert(
      "Recusar proposta",
      "Tem certeza que deseja recusar esta proposta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Recusar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await rejectProposal(proposal.id);
              router.back();
            } catch {
              Alert.alert("Erro", "Não foi possível recusar a proposta.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const iniciais = getInitials(proposal.profissional.nome);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da proposta</Text>
      </View>

      <ScrollView>
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.professionalCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{iniciais}</Text>
              </View>
              <View style={styles.professionalInfo}>
                <Text style={styles.professionalName}>{proposal.profissional.nome}</Text>
                <Text style={styles.professionalRating}>
                  ⭐ {proposal.profissional.notaMedia.toFixed(1)} ({proposal.profissional.totalAvaliacoes} avaliações)
                </Text>
                {proposal.profissional.bio && (
                  <Text style={styles.professionalBio}>{proposal.profissional.bio}</Text>
                )}
              </View>
            </View>
          </View>

          {proposal.descricao && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Mensagem do profissional</Text>
              <Text style={styles.sectionText}>{proposal.descricao}</Text>
            </View>
          )}

          {proposal.tempoEstimado && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Tempo estimado</Text>
              <Text style={styles.sectionText}>{proposal.tempoEstimado}</Text>
            </View>
          )}

          {proposal.profissional.especialidades && proposal.profissional.especialidades.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Especialidades</Text>
              <View style={styles.tagRow}>
                {proposal.profissional.especialidades.map((e) => (
                  <View key={e} style={styles.tag}>
                    <Text style={styles.tagText}>{e}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Resumo financeiro</Text>
            <View style={styles.financeRow}>
              <Text style={styles.financeLabel}>Valor da proposta</Text>
              <Text style={styles.financeValue}>R$ {proposal.valor.toFixed(2)}</Text>
            </View>
            {proposal.expiraEm && (
              <View style={styles.financeRow}>
                <Text style={styles.financeLabel}>Proposta válida até</Text>
                <Text style={styles.financeValue}>{new Date(proposal.expiraEm).toLocaleDateString("pt-BR")}</Text>
              </View>
            )}
            <View style={styles.financeTotalRow}>
              <Text style={styles.financeTotalLabel}>Total</Text>
              <Text style={styles.financeTotalValue}>R$ {proposal.valor.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={handleRecusar}
          disabled={loading}
        >
          <Text style={styles.rejectButtonText}>Recusar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.acceptButton, loading && styles.buttonDisabled]}
          onPress={handleAceitar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.acceptButtonText}>Aceitar proposta</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    gap: 8,
  },
  backArrow: {
    fontSize: 24,
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
  },
  professionalCard: {
    flexDirection: "row",
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontWeight: "700",
    color: "#4b5563",
    fontSize: 18,
  },
  professionalInfo: {
    flex: 1,
    gap: 4,
  },
  professionalName: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
  },
  professionalRating: {
    fontSize: 14,
    color: "#f97316",
  },
  professionalBio: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: "#111827",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#fff7ed",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    color: "#f97316",
    fontSize: 12,
  },
  financeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  financeLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  financeValue: {
    fontSize: 14,
    color: "#111827",
  },
  financeTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 12,
  },
  financeTotalLabel: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
  },
  financeTotalValue: {
    fontWeight: "700",
    fontSize: 16,
    color: "#f97316",
  },
  bottomBar: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  rejectButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f97316",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  rejectButtonText: {
    color: "#f97316",
    fontWeight: "700",
    fontSize: 16,
  },
  acceptButton: {
    flex: 2,
    backgroundColor: "#f97316",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
