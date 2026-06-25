import React, { useState } from "react";
import { View,
  Text,
  StyleSheet,TextInput,
  FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Mock de categorias
const allCategories = [
  { id: "1", name: "Elétrica", icon: "lightning-bolt" },
  { id: "2", name: "Pedreiro", icon: "wrench" },
  { id: "3", name: "Encanamento", icon: "water" },
  { id: "4", name: "Pintura", icon: "format-paint" },
  { id: "5", name: "Marcenaria", icon: "hammer" },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // NOVA FUNÇÃO: Dispara a busca por termo
  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      router.push({
        pathname: "/(client)/(home)/category/[id]",
        params: {
          id: "Resultados da busca", // Título que aparecerá no header
          termo: searchQuery, // O termo que a API vai usar
        },
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Encontrar Profissional</Text>
      </View>

      {/* Input de Pesquisa */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputWrapper, { backgroundColor: colors.surface }]}>
          {/* Adicionado Touchable para clicar na lupa */}
          <Pressable onPress={handleSearch}>
            <Feather name="search" size={20} color={colors.textSecondary} />
          </Pressable>
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Buscar por nome ou categoria..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search" // Muda o botão do teclado para "Buscar"
            onSubmitEditing={handleSearch} // Dispara ao pressionar "Buscar"
          />
        </View>
      </View>

      {/* Grade de Categorias */}
      <View style={styles.listContainer}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Todas as categorias</Text>
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.categoryCard, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() =>
                router.push({
                  pathname: "/(client)/(home)/category/[id]",
                  params: {
                    id: item.name,
                    icon: item.icon,
                    categoriaId: item.id, // <-- AQUI ESTÁ A CORREÇÃO!
                  },
                })
              }
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={32}
                color={colors.brand}
              />
              <Text style={[styles.categoryCardText, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />
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
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    padding: 8,
  },
  categoryCardText: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 8,
    textAlign: "center",
  },
});
