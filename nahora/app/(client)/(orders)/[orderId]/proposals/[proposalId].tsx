import React, { useState } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProposalDetail, useProposalActions } from "@/features/proposals/hooks/useProposals";
import { ProposalDetailContent } from "@/features/proposals/components/ProposalDetailContent";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function DetalhePropostaScreen() {
  const { orderId, proposalId } = useLocalSearchParams<{
    orderId: string;
    proposalId: string;
  }>();
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [loading, setLoading] = useState(false);

  const pedidoId = Number(orderId);
  const propId = Number(proposalId);

  const { proposal, isLoading, isError } = useProposalDetail(pedidoId, propId);
  const { acceptProposal, rejectProposal } = useProposalActions(pedidoId);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.chat.brandOrange} />
      </View>
    );
  }

  if (isError || !proposal) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Erro ao carregar proposta.
        </Text>
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
              router.replace(
                `/(client)/(orders)/${orderId}?acceptedProposalId=${proposal.id}`,
              );
            } catch {
              Alert.alert("Erro", "Não foi possível aceitar a proposta.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleRecusar = () => {
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
      ],
    );
  };

  return (
    <ProposalDetailContent
      proposal={proposal}
      onBack={() => router.back()}
      onAccept={handleAceitar}
      onReject={handleRecusar}
      isAccepting={loading}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
  },
});
