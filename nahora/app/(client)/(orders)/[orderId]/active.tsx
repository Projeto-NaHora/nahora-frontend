import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useSWR from "swr";
import { orderService } from "@/features/orders/service";

const STATUS_TIMELINE = [
  { key: "CRIADO", label: "Pedido criado" },
  { key: "PROPOSTA_ACEITA", label: "Proposta acordada" },
  { key: "EM_ANDAMENTO", label: "Serviço em andamento" },
  { key: "CONCLUIDO", label: "Concluído" },
];

export default function PedidoAtivoScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();

  const { data: pedido, isLoading, error } = useSWR(
    orderId ? `/pedidos/${orderId}` : null,
    () => orderService.buscarPorId(Number(orderId))
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (error || !pedido) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500 text-sm">Erro ao carregar pedido.</Text>
      </View>
    );
  }

  const statusIndex = STATUS_TIMELINE.findIndex((s) => s.key === pedido.status);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center p-4 bg-white gap-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-2xl mr-1">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold flex-1 text-gray-900">Detalhe do Pedido</Text>
        <View className="bg-green-50 rounded-full px-3 py-1">
          <Text className="text-green-800 text-xs font-bold">Em andamento</Text>
        </View>
      </View>

      <ScrollView>
        <View className="p-4 gap-4">
          <View className="bg-white rounded-xl p-4 gap-3">
            <Text className="font-bold text-lg text-gray-900">{pedido.titulo}</Text>

            <View className="flex-row gap-6">
              <View className="gap-1">
                <Text className="text-xs text-gray-400 uppercase">Data</Text>
                <Text className="text-sm text-gray-800 font-medium">
                  {new Date(pedido.criadoEm).toLocaleDateString("pt-BR")}
                </Text>
              </View>
              <View className="gap-1">
                <Text className="text-xs text-gray-400 uppercase">Horário</Text>
                <Text className="text-sm text-gray-800 font-medium">
                  {new Date(pedido.criadoEm).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>

            <View className="gap-1">
              <Text className="text-xs text-gray-400 uppercase">Endereço</Text>
              <Text className="text-sm text-gray-800 font-medium">—</Text>
            </View>

            <View className="gap-1">
              <Text className="text-xs text-gray-400 uppercase">DESCRIÇÃO</Text>
              <Text className="text-sm text-gray-600 leading-5">{pedido.descricao}</Text>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 gap-3">
            <Text className="font-bold text-base mb-2 text-gray-900">Linha do tempo</Text>
            {STATUS_TIMELINE.map((item, index) => {
              const concluido = index <= statusIndex;
              const atual = index === statusIndex;

              let dotClass = "bg-gray-200 border-gray-300";
              if (concluido) dotClass = "bg-green-500 border-green-500";
              if (atual) dotClass = "bg-orange-500 border-orange-500";

              return (
                <View key={item.key} className="flex-row items-start gap-3">
                  <View className="items-center w-4">
                    <View className={`w-3.5 h-3.5 rounded-full border-2 ${dotClass}`} />
                    {index < STATUS_TIMELINE.length - 1 && (
                      <View className={`w-0.5 h-8 ${concluido ? "bg-green-500" : "bg-gray-200"}`} />
                    )}
                  </View>
                  <Text className={`text-sm ${concluido ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                    {item.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="p-4 gap-2.5 bg-white border-t border-gray-100">
        <TouchableOpacity className="border border-gray-300 rounded-lg py-3.5 items-center">
          <Text className="text-gray-600 text-[15px]">Tive um problema</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-orange-500 rounded-lg py-3.5 items-center"
          onPress={() => router.push(`/(client)/(chats)/${pedido.id}`)}
        >
          <Text className="text-white font-bold text-[15px]">Falar com profissional</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}