import React from "react";
import { View,
  Text,
  FlatList,StyleSheet,
  ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useFavoritesList } from "@/features/favorites/hooks/useFavoritesList";
import { FavoriteCard } from "@/features/favorites/components/FavoriteCard";
import { favoritesService } from "@/features/favorites/service";
import type { FavoritoResponseDTO } from "@/features/favorites/types";

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, totalElements, isLoading, error, mutate } =
    useFavoritesList();

  const handleToggleFavorite = async (professional: FavoritoResponseDTO) => {
    try {
      await favoritesService.desfavoritar(professional.profissionalId);
      mutate(); // revalida
    } catch {
      // erro silencioso — o SWR vai revalidar na próxima montagem
    }
  };

  const handlePressProfessional = (professional: FavoritoResponseDTO) => {
    router.push(
      `/(client)/(home)/professional/${professional.profissionalId}`,
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color="#1c1c1e" />
        </Pressable>

        <Text style={styles.headerTitle}>Meus favoritos</Text>

        {/* Placeholder for symmetry */}
        <View style={[styles.backButton, { opacity: 0 }]} />
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#f26f21" />
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.errorText}>
            Não foi possível carregar seus favoritos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.profissionalId.toString()}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={styles.countText}>
                {favorites.length} profissional
                {favorites.length !== 1 ? "s" : ""} salvo
                {favorites.length !== 1 ? "s" : ""}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Ionicons name="heart-outline" size={48} color="#8e8e93" />
              <Text style={styles.emptyText}>
                Você ainda não salvou nenhum profissional.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <FavoriteCard
              professional={item}
              onPress={() => handlePressProfessional(item)}
              onToggleFavorite={() => handleToggleFavorite(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(244, 244, 245, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#1c1c1e",
    lineHeight: 28.5,
  },
  sectionHeader: {
    paddingHorizontal: 8,
    marginBottom: 16.5,
  },
  countText: {
    fontSize: 15,
    fontFamily: "Inter",
    fontWeight: "400",
    color: "#8e8e93",
    lineHeight: 22.5,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 15,
    fontFamily: "Inter",
    color: "#8e8e93",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter",
    color: "#8e8e93",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
