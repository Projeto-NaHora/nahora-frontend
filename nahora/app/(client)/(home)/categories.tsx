import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

// Conforme PRD: 12 categorias com ícone e nome
const allCategories = [
  { id: "1", name: "Elétrica", icon: "lightning-bolt" },
  { id: "2", name: "Encanamento", icon: "wrench" },
  { id: "3", name: "Pintura", icon: "format-paint" },
  { id: "4", name: "Limpeza", icon: "sparkles" },
  { id: "5", name: "Marcenaria", icon: "hammer" },
  { id: "6", name: "Mudanças", icon: "package-variant-closed" },
  { id: "7", name: "Ar-cond.", icon: "snowflake" },
  { id: "8", name: "Pedreiro", icon: "trowel" },
  { id: "9", name: "Jardim", icon: "leaf" },
  { id: "10", name: "Montagem", icon: "screwdriver" },
  { id: "11", name: "Chaveiro", icon: "key" },
  { id: "12", name: "Fretes", icon: "truck-outline" },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com botão de voltar e título */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Encontrar Profissional</Text>
      </View>

      {/* Input de Pesquisa */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou categoria..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Grade de Categorias */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Todas as categorias</Text>
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() =>
                router.push({
                  pathname: "/(client)/(home)/category/[id]",
                  params: {
                    id: item.name,
                    icon: item.icon,
                  },
                })
              }
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={32}
                color="#F97316"
              />
              <Text style={styles.categoryCardText} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />{" "}
        {/* <-- Era essa barrinha que estava faltando! */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#111827",
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  flatListContent: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 14,
    marginBottom: 16,
  },
  categoryCard: {
    flex: 1,
    maxWidth: "31%",
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    padding: 8,
  },
  categoryCardText: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 8,
    textAlign: "center",
  },
});
