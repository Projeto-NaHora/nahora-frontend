import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ProfessionalListCard from "@/components/ui/ProfessionalListCard";
import { SafeAreaView } from "react-native-safe-area-context";

const mockProfessionals = [
  {
    id: "1",
    name: "Rafael Borges",
    category: "Eletricista",
    distance: 1.2,
    rating: 4.9,
    reviews: 87,
    price: 80,
    isPlus: true,
  },
  {
    id: "2",
    name: "Juliana Lima",
    category: "Eletricista",
    distance: 2.5,
    rating: 4.7,
    reviews: 54,
    price: 75,
    isPlus: false,
  },
  {
    id: "3",
    name: "Carlos Souza",
    category: "Eletricista",
    distance: 0.8,
    rating: 5.0,
    reviews: 120,
    price: 90,
    isPlus: true,
  },
  {
    id: "4",
    name: "Beatriz Ramos",
    category: "Eletricista",
    distance: 3.1,
    rating: 4.8,
    reviews: 32,
    price: 70,
    isPlus: false,
  },
];

const FILTERS = [
  { label: "Todos", value: "all" },
  { label: "Melhor avaliação", value: "best" },
  { label: "Mais próximos", value: "near" },
];

export default function ProvidersByCategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, icon } = params as { id?: string; icon?: string };

  const [activeFilter, setActiveFilter] = useState("all");

  // Lógica de ordenação inteligente
  const sortedProfessionals = useMemo(() => {
    let result = [...mockProfessionals];

    if (activeFilter === "best") {
      // Ordena da maior para a menor nota
      result.sort((a, b) => b.rating - a.rating);
    } else if (activeFilter === "near") {
      // Ordena da menor para a maior distância
      result.sort((a, b) => a.distance - b.distance);
    }

    return result;
  }, [activeFilter]);

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

      {/* Contagem dinâmica baseada no array ordenado */}
      <Text style={styles.countText}>
        {sortedProfessionals.length} profissionais encontrados
      </Text>

      {/* Lista */}
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
              // Rota direta usando template literal (crases)
              router.push(`/(client)/(home)/professional/${item.id}`);
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />
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
});
