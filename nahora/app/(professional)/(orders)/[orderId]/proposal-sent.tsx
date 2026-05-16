import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ProposalSentScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white justify-between">
      <View className="flex-1 justify-center items-center px-8 gap-5">
        <View className="w-20 h-20 rounded-full bg-green-50 justify-center items-center mb-2">
          <Text className="text-[36px] text-green-500 font-bold">✓</Text>
        </View>

        <Text className="text-[22px] font-bold text-gray-900 text-center">
          Interesse enviado com sucesso!
        </Text>

        <Text className="text-[15px] text-gray-600 text-center leading-[22px]">
          O cliente já recebeu sua proposta e poderá entrar em contato pelo chat.
        </Text>
      </View>

      <View className="p-6 border-t border-gray-200">
        <TouchableOpacity
          className="border border-gray-300 rounded-lg py-3.5 items-center"
          onPress={() => router.replace("/(professional)/(home)")}
        >
          <Text className="text-gray-700 text-[15px] font-medium">Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}