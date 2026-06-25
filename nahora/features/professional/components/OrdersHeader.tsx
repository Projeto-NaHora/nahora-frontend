// features/professional/components/OrdersHeader.tsx
import React, { useState, useCallback } from "react";
import { View,
  Text,
  TextInput,StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface OrdersHeaderProps {
  /** Se fornecido, exibe a search bar preenchida com valor inicial (tela de busca) */
  initialSearch?: string;
  /** Se true, a search bar atua como input real (tela de busca); se false, é um botão (tela de pedidos) */
  searchMode?: boolean;
  /** Callback chamado ao submeter a busca (apenas em searchMode) */
  onSearch?: (termo: string) => void;
}

export function OrdersHeader({
  initialSearch = "",
  searchMode = false,
  onSearch,
}: OrdersHeaderProps) {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [searchText, setSearchText] = useState(initialSearch);

  const handleSubmitSearch = () => {
    const termo = searchText.trim();
    if (termo.length >= 2 && onSearch) {
      onSearch(termo);
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
  };

  const handleSearchBarPress = () => {
    if (!searchMode) {
      router.push("/(professional)/(orders)/search");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.brand }]}>
      {/* Área de atuação label */}
      <Text style={styles.areaLabel}>SUA ÁREA DE ATUAÇÃO</Text>

      {/* Cidade + dropdown */}
      <View style={styles.locationRow}>
        <Text style={styles.cityName}>Recife, PE</Text>
      </View>

      {/* Raio */}
      <Text style={styles.radiusText}>Raio de 10km</Text>

      {/* Search bar */}
      {searchMode ? (
        <View style={styles.searchBarActive}>
          <View style={styles.searchBarInner}>
            <Feather name="search" size={20} color="rgba(255,255,255,0.7)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar serviços..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSubmitSearch}
              returnKeyType="search"
              autoFocus
            />
            {searchText.length > 0 && (
              <Pressable
                onPress={handleClearSearch}
                style={styles.clearButton}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Feather name="x" size={18} color="rgba(255,255,255,1)" />
              </Pressable>
            )}
          </View>
        </View>
      ) : (
        <Pressable
          style={styles.searchBar}
          onPress={handleSearchBarPress}
        >
          <Feather name="search" size={20} color="rgba(255,255,255,0.7)" />
          <Text style={styles.searchPlaceholder}>Buscar serviços...</Text>
          <View style={styles.divider} />
          <Feather name="sliders" size={20} color="rgba(255,255,255,1)" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  areaLabel: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  cityName: {
    fontSize: 20,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  radiusText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "rgba(255,255,255,0.9)",
    marginTop: 6,
    marginBottom: 24,
  },
  // Search bar as a button (orders list screen)
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 32,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  // Active search bar (search screen)
  searchBarActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 32,
    overflow: "hidden",
  },
  searchBarInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "#FFFFFF",
    padding: 0,
  },
  clearButton: {
    padding: 4,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.3)",
    paddingLeft: 12,
  },
});
