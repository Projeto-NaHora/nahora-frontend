import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProposalsByPedido } from "@/features/proposals/hooks/useProposals";
import type { Proposta } from "@/features/proposals/types";

type OrdemFiltro = "melhor_avaliacao" | "menor_preco" | "mais_rapido";

export default function PropostasScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const [filtro, setFiltro] = useState<OrdemFiltro>("melhor_avaliacao");

  const { proposals, isLoading, isError } = useProposalsByPedido(Number(orderId));

  const propostasOrdenadas = [...(proposals ?? [])].sort((a, b) => {
    if (filtro === "menor_preco") return a.valor - b.valor;
    if (filtro === "melhor_avaliacao") return b.profissional.notaMedia - a.profissional.notaMedia;
    return 0;
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500 text-sm">Erro ao carregar propostas. Tente novamente.</Text>
      </View>
    );
  }

  if (!proposals || proposals.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-400 text-sm">Nenhuma proposta recebida ainda.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center p-4 bg-white gap-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-2xl mr-1">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold flex-1 text-gray-900">Interessados</Text>
        <View className="bg-orange-500 rounded-full px-2 py-0.5">
          <Text className="text-white font-bold text-sm">{proposals.length}</Text>
        </View>
      </View>

      <View className="flex-row bg-white px-3 pb-2.5 gap-2">
        {(["melhor_avaliacao", "menor_preco", "mais_rapido"] as OrdemFiltro[]).map((f) => (
          <TouchableOpacity
            key={f}
            className={`px-3 py-1.5 rounded-full ${filtro === f ? "bg-orange-500" : "bg-gray-100"}`}
            onPress={() => setFiltro(f)}
          >
            <Text className={`text-xs ${filtro === f ? "text-white font-bold" : "text-gray-500"}`}>
              {f === "melhor_avaliacao" ? "Melhor avaliação" : f === "menor_preco" ? "Menor preço" : "Mais rápido"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={propostasOrdenadas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        renderItem={({ item, index }) => (
          <PropostaCard
            proposta={item}
            destacada={index === 0 && filtro === "melhor_avaliacao"}
            onNegociar={() => router.push(`/(client)/(orders)/${orderId}/proposals/${item.id}`)}
            onVerPerfil={() => router.push(`/(client)/profile/${item.profissional.id}`)}
          />
        )}
      />
    </View>
  );
}

function PropostaCard({
  proposta,
  destacada,
  onNegociar,
  onVerPerfil,
}: {
  proposta: Proposta;
  destacada: boolean;
  onNegociar: () => void;
  onVerPerfil: () => void;
}) {
  const iniciais = proposta.profissional.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <View className={`bg-white rounded-xl p-4 gap-2.5 ${destacada ? "border-2 border-orange-500" : ""}`}>
      {destacada && (
        <View className="bg-orange-50 rounded-md px-2 py-1 self-start">
          <Text className="text-orange-500 text-xs font-bold">MELHOR AVALIADO</Text>
        </View>
      )}

      <View className="flex-row items-center gap-2.5">
        <View className="w-11 h-11 rounded-full bg-gray-200 justify-center items-center">
          {proposta.profissional.foto ? (
            <Image source={{ uri: proposta.profissional.foto }} className="w-11 h-11 rounded-full" />
          ) : (
            <Text className="font-bold text-gray-500 text-sm">{iniciais}</Text>
          )}
        </View>
        <View className="flex-1">
          <Text className="font-bold text-sm text-gray-900">{proposta.profissional.nome}</Text>
          <Text className="text-xs text-orange-500">
            ⭐ {proposta.profissional.notaMedia.toFixed(1)} ({proposta.profissional.totalAvaliacoes} aval.)
          </Text>
          <Text className="text-xs text-gray-400">{proposta.profissional.totalServicosExecutados} serviços feitos</Text>
        </View>
        <Text className="font-bold text-sm text-gray-900">R$ {proposta.valor.toFixed(0)}</Text>
      </View>

      {proposta.descricao && (
        <Text className="text-xs text-gray-500 italic" numberOfLines={3}>
          &ldquo;{proposta.descricao}&rdquo;
        </Text>
      )}

      {proposta.tempoEstimado && (
        <Text className="text-xs text-gray-400">⏱ {proposta.tempoEstimado}</Text>
      )}

      <View className="flex-row gap-2 mt-1">
        <TouchableOpacity className="flex-1 border border-orange-500 rounded-lg py-2 items-center" onPress={onNegociar}>
          <Text className="text-orange-500 font-bold text-sm">Negociar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-orange-500 rounded-lg py-2 items-center" onPress={onVerPerfil}>
          <Text className="text-white font-bold text-sm">Ver perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}