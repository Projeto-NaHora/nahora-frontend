import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProposalDetail, useProposalActions } from "@/features/proposals/hooks/useProposals";

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
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (isError || !proposal) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500 text-sm">Erro ao carregar proposta.</Text>
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

  const iniciais = proposal.profissional.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center p-4 bg-white gap-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-2xl mr-1">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Detalhes da proposta</Text>
      </View>

      <ScrollView>
        {/* Nova View envoltória corrigida aqui */}
        <View className="p-4 gap-4">
          <View className="bg-white rounded-xl p-4 flex-row gap-3">
            <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center">
              <Text className="font-bold text-gray-600 text-lg">{iniciais}</Text>
            </View>
            <View className="flex-1 gap-1">
              <Text className="font-bold text-base text-gray-900">{proposal.profissional.nome}</Text>
              <Text className="text-sm text-orange-500">
                ⭐ {proposal.profissional.notaMedia.toFixed(1)} ({proposal.profissional.totalAvaliacoes} avaliações)
              </Text>
              {proposal.profissional.bio && (
                <Text className="text-xs text-gray-500 mt-1">{proposal.profissional.bio}</Text>
              )}
            </View>
          </View>

          {proposal.descricao && (
            <View className="bg-white rounded-xl p-4 gap-2">
              <Text className="font-bold text-sm text-gray-900">Mensagem do profissional</Text>
              <Text className="text-sm text-gray-600 leading-5">{proposal.descricao}</Text>
            </View>
          )}

          {proposal.tempoEstimado && (
            <View className="bg-white rounded-xl p-4 gap-2">
              <Text className="font-bold text-sm text-gray-900">Tempo estimado</Text>
              <Text className="text-sm text-gray-600">{proposal.tempoEstimado}</Text>
            </View>
          )}

          {proposal.profissional.especialidades && proposal.profissional.especialidades.length > 0 && (
            <View className="bg-white rounded-xl p-4 gap-2">
              <Text className="font-bold text-sm text-gray-900">Especialidades</Text>
              <View className="flex-row flex-wrap gap-2">
                {proposal.profissional.especialidades.map((e) => (
                  <View key={e} className="bg-orange-50 rounded-full px-3 py-1">
                    <Text className="text-orange-500 text-xs">{e}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View className="bg-white rounded-xl p-4 gap-3">
            <Text className="font-bold text-sm text-gray-900">Resumo financeiro</Text>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-500">Valor da proposta</Text>
              <Text className="text-sm text-gray-900">R$ {proposal.valor.toFixed(2)}</Text>
            </View>
            {proposal.expiraEm && (
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Proposta válida até</Text>
                <Text className="text-sm text-gray-900">{new Date(proposal.expiraEm).toLocaleDateString("pt-BR")}</Text>
              </View>
            )}
            <View className="flex-row justify-between border-t border-gray-100 pt-3">
              <Text className="font-bold text-base text-gray-900">Total</Text>
              <Text className="font-bold text-base text-orange-500">R$ {proposal.valor.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="flex-row p-4 gap-3 bg-white border-t border-gray-100">
        <TouchableOpacity
          className="flex-1 border border-orange-500 rounded-lg py-3 items-center"
          onPress={handleRecusar}
          disabled={loading}
        >
          <Text className="text-orange-500 font-bold text-base">Recusar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-[2] bg-orange-500 rounded-lg py-3 items-center ${loading ? "opacity-60" : ""}`}
          onPress={handleAceitar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">Aceitar proposta</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}