import { api } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ProfessionalListCard from "@/components/ui/ProfessionalListCard";
import { SafeAreaView } from "react-native-safe-area-context";

const FILTERS = [
  { label: "Todos", value: "all" },
  { label: "Melhor avaliação", value: "best" },
  { label: "Mais próximos", value: "near" },
];

export default function ProvidersByCategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Pegamos os parâmetros extras que preparamos para a API
  const { id, icon, categoriaId, termo } = params as {
    id?: string;
    icon?: string;
    categoriaId?: string;
    termo?: string;
  };

  const [activeFilter, setActiveFilter] = useState("all");

  // Estados reais para a API
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito que dispara a busca real no backend
  useEffect(() => {
    async function fetchProfessionals() {
      setIsLoading(true);
      try {
        let response;

        if (termo) {
          response = await api.get(ENDPOINTS.PROFISSIONAIS + "/busca", {
            params: { termo: termo },
          });
        } else if (categoriaId) {
          response = await api.get(ENDPOINTS.PROFISSIONAIS, {
            params: { categoriaId: categoriaId },
          });
        } else {
          setProfessionals([]);
          setIsLoading(false);
          return;
        }

        // --- DEBUG PARA O TERMINAL DO EXPO ---
        console.log(">>> STATUS DA API:", response.status);
        console.log(
          ">>> PAYLOAD COMPLETO:",
          JSON.stringify(response.data, null, 2),
        );

        // Estratégia de extração flexível: procura o array em vários lugares comuns do Spring Boot
        const payload = response.data;
        const arrayDeProfissionais = Array.isArray(payload)
          ? payload
          : payload?.profissionais || payload?.content || payload?.data || [];

        if (arrayDeProfissionais.length === 0) {
          console.warn(
            ">>> ATENÇÃO: O backend retornou 200, mas o array não foi encontrado no Frontend.",
          );
        }

        // Mapeamento "À prova de balas" com fallbacks de segurança
        const dataMapped = arrayDeProfissionais.map((prof: any) => ({
          // Garante um ID válido para não quebrar a FlatList
          id: prof?.id?.toString() || Math.random().toString(),
          name: prof?.nome || prof?.name || "Profissional Sem Nome",
          category:
            prof?.categoria ||
            prof?.categoriaNome ||
            (id as string) ||
            "Serviços",
          distance: prof?.distanciaKm || prof?.distancia || 0,
          rating: prof?.mediaAvaliacoes ?? 0,
          reviews: prof?.totalAvaliacoes ?? 0,
          price: 0,
          isPlus: prof?.planoPlus || prof?.isPlus || false,
        }));

        setProfessionals(dataMapped);
      } catch (error) {
        console.error(">>> ERRO FATAL AO LER DADOS DA API:", error);
        setProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfessionals();
  }, [categoriaId, termo]);
  // Lógica de ordenação inteligente (agora baseada nos dados da API)
  const sortedProfessionals = useMemo(() => {
    let result = [...professionals];

    if (activeFilter === "best") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (activeFilter === "near") {
      result.sort((a, b) => a.distance - b.distance);
    }

    return result;
  }, [professionals, activeFilter]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#22223B" />
        </TouchableOpacity>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons
            name={(icon as any) || "account"}
            size={28}
            color="#7C3AED"
          />
        </View>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {id || "Categoria"}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[
                styles.pill,
                activeFilter === f.value && styles.pillActive,
              ]}
              onPress={() => setActiveFilter(f.value)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.pillText,
                  activeFilter === f.value && styles.pillTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Condicional de Loading e Lista */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7A00" />
          <Text style={styles.loadingText}>Buscando profissionais...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.countText}>
            {sortedProfessionals.length} profissionais encontrados
          </Text>

          <FlatList
            data={sortedProfessionals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProfessionalListCard
                name={item.name}
                category={item.category}
                distance={item.distance}
                rating={item.rating}
                reviews={item.reviews}
                price={item.price}
                isPlus={item.isPlus}
                onPress={() => {
                  router.push({
                    pathname: "/professional/[id]",
                    params: { id: item.id },
                  });
                }}
              />
            )}
            contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Nenhum profissional encontrado para esta categoria.
              </Text>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 10,
  },
  backBtn: {
    padding: 4,
    marginRight: 2,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#22223B",
    flex: 1,
  },
  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 10,
  },
  pillActive: {
    backgroundColor: "#FF9800",
  },
  pillText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 14,
  },
  pillTextActive: {
    color: "#fff",
  },
  countText: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
    paddingHorizontal: 18,
    marginBottom: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 40,
    fontSize: 15,
  },
});
