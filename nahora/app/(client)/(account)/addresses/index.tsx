import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import useSWR from "swr";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Fonts } from "@/constants/theme";
import { getApiErrorMessage } from "@/utils/apiError";
import { profileService } from "@/features/profile/service";
import type { EnderecoResponse } from "@/features/profile/types";
import { TIPO_ENDERECO_LABEL } from "@/features/profile/types";

function formatAddressLine(end: EnderecoResponse): string {
  const parts = [end.logradouro, end.numero];
  if (end.complemento) parts.push(end.complemento);
  return parts.join(", ");
}

export default function Screen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: addresses,
    isLoading,
    error,
    mutate,
  } = useSWR<EnderecoResponse[]>("enderecos", () =>
    profileService.listarEnderecos(),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
  };

  const showActions = useCallback(
    (endereco: EnderecoResponse) => {
      Alert.alert(
        TIPO_ENDERECO_LABEL[endereco.tipo] ?? endereco.apelido ?? "Endereço",
        undefined,
        [
          {
            text: "Editar",
            onPress: () =>
              router.push(
                `/(client)/(account)/addresses/add?id=${endereco.id}`,
              ),
          },
          ...(endereco.padrao
            ? []
            : [
                {
                  text: "Tornar padrão",
                  onPress: async () => {
                    try {
                      await profileService.definirEnderecoPadrao(endereco.id);
                      mutate();
                    } catch (err: any) {
                      Alert.alert(
                        "Erro",
                        getApiErrorMessage(err, "Não foi possível alterar."),
                      );
                    }
                  },
                },
              ] as any),
          {
            text: "Excluir",
            style: "destructive" as const,
            onPress: () => {
              Alert.alert(
                "Excluir endereço",
                "Tem certeza que deseja excluir este endereço?",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await profileService.deletarEndereco(endereco.id);
                        mutate();
                      } catch (err: any) {
                        Alert.alert(
                          "Erro",
                          getApiErrorMessage(
                            err,
                            "Não foi possível excluir.",
                          ),
                        );
                      }
                    },
                  },
                ],
              );
            },
          },
          { text: "Cancelar", style: "cancel" },
        ],
      );
    },
    [mutate],
  );

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (error) {
    console.error("[A01] Erro ao carregar endereços:", error);
    const mensagem = getApiErrorMessage(
      error,
      "Erro de conexão com o servidor",
    );
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorIcon]}>⚠️</Text>
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          Não foi possível carregar seus endereços
        </Text>
        <Text style={[styles.errorDetail, { color: colors.textSecondary }]}>
          {mensagem}
        </Text>
        <Pressable
          onPress={() => mutate()}
          style={({ pressed }) => [
            styles.retryButton,
            { backgroundColor: colors.brand },
            pressed && styles.retryButtonPressed,
          ]}
        >
          <Text style={[styles.retryButtonText, { color: colors.onBrand }]}>
            Tentar novamente
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: "rgba(244,244,245,0.6)" },
            pressed && styles.backButtonPressed,
          ]}
        >
          <IconSymbol name="chevron.left" size={20} color="#1c1c1e" />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Endereços salvos
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={addresses ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Endereços salvos</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhum endereço salvo
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const title =
            item.tipo === "OUTRO" && item.apelido
              ? item.apelido
              : TIPO_ENDERECO_LABEL[item.tipo] ?? item.tipo;
          return (
            <View style={styles.cardWrapper}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.background,
                    borderColor: "#eaeaea",
                  },
                ]}
              >
                {/* Left icon */}
                <View style={styles.cardIcon}>
                  <IconSymbol
                    name="location-on"
                    size={20}
                    color="#f27b24"
                  />
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                  {/* Title row */}
                  <View style={styles.cardTitleRow}>
                    <View style={styles.cardTitleLeft}>
                      <Text
                        style={[
                          styles.cardTitle,
                          { color: colors.textPrimary },
                        ]}
                      >
                        {title}
                      </Text>
                      {item.padrao && (
                        <View style={styles.padraoBadge}>
                          <Text style={styles.padraoBadgeText}>PADRÃO</Text>
                        </View>
                      )}
                    </View>

                    <Pressable
                      onPress={() => showActions(item)}
                      hitSlop={8}
                      style={styles.menuButton}
                    >
                      <IconSymbol
                        name="edit"
                        size={18}
                        color="#8c8c8c"
                      />
                    </Pressable>
                  </View>

                  {/* Address line */}
                  <Text
                    style={[
                      styles.addressLine,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {formatAddressLine(item)}
                  </Text>

                  {/* Neighborhood / city */}
                  <Text
                    style={[
                      styles.neighborhoodLine,
                      { color: "rgba(140,140,140,0.8)" },
                    ]}
                    numberOfLines={1}
                  >
                    {item.bairro}, {item.cidade} - {item.uf}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          <View style={styles.footerSection}>
            <View style={styles.footerBorder} />
            <Pressable
              onPress={() =>
                router.push("/(client)/(account)/addresses/add")
              }
              style={({ pressed }) => [
                styles.addButton,
                {
                  backgroundColor: colors.background,
                  borderColor: "#eaeaea",
                },
                pressed && styles.addButtonPressed,
              ]}
            >
              <View style={styles.addIconWrapper}>
                <IconSymbol
                  name="location-on"
                  size={20}
                  color="#e67215"
                />
              </View>
              <Text style={styles.addButtonText}>
                Adicionar novo endereço
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorText: {
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
    textAlign: "center",
  },
  errorDetail: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 27,
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },

  // List
  listContent: {
    paddingBottom: 40,
  },

  // Section header
  sectionHeader: {
    paddingHorizontal: 24,
    paddingBottom: 4,
    paddingTop: 12,
  },
  sectionTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    color: "#111111",
  },

  // Empty
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "400",
  },

  // Card
  cardWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  card: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "rgba(234,234,234,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
    gap: 2,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 16,
  },
  padraoBadge: {
    backgroundColor: "#fff2e5",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  padraoBadgeText: {
    fontFamily: Fonts?.sans,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 10,
    color: "#e67215",
    letterSpacing: 0.5,
  },
  menuButton: {
    padding: 4,
  },
  addressLine: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 19.25,
  },
  neighborhoodLine: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 17.88,
  },

  // Footer
  footerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  footerBorder: {
    height: 1,
    backgroundColor: "#eaeaea",
    marginBottom: 28,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 18,
  },
  addButtonPressed: {
    opacity: 0.7,
  },
  addIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff2e5",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    color: "#e67215",
  },
});
