import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
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
import type { PerfilProfissionalDTO } from "@/features/profile/types";

function formatAddressLine(profile: PerfilProfissionalDTO): string {
  const parts = [profile.logradouro, profile.numero];
  if (profile.complemento) parts.push(profile.complemento);
  return parts.filter(Boolean).join(", ");
}

function formatNeighborhood(profile: PerfilProfissionalDTO): string {
  const parts = [profile.bairro, profile.cidade, profile.estado];
  return parts.filter(Boolean).join(", ");
}

function hasAddress(profile: PerfilProfissionalDTO): boolean {
  return !!(profile.cep || profile.logradouro || profile.cidade);
}

export default function Screen() {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const {
    data: profile,
    isLoading,
    error,
    mutate,
  } = useSWR<PerfilProfissionalDTO>("perfil-profissional", () =>
    profileService.buscarPerfilParaEdicao(),
  );

  const handleEdit = useCallback(() => {
    router.push("/(professional)/(account)/addresses/add");
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (error) {
    console.error("[PA01] Erro ao carregar perfil:", error);
    const mensagem = getApiErrorMessage(
      error,
      "Erro de conexão com o servidor",
    );
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorIcon]}>⚠️</Text>
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          Não foi possível carregar seu endereço
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

  const addressExists = profile ? hasAddress(profile) : false;

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
          Endereço de atendimento
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Endereço de atendimento</Text>
        </View>

        {addressExists && profile ? (
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
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: colors.textPrimary },
                    ]}
                  >
                    {profile.profissao ?? "Endereço"}
                  </Text>

                  <Pressable
                    onPress={handleEdit}
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
                  {formatAddressLine(profile)}
                </Text>

                {/* Neighborhood / city */}
                <Text
                  style={[
                    styles.neighborhoodLine,
                    { color: "rgba(140,140,140,0.8)" },
                  ]}
                  numberOfLines={1}
                >
                  {formatNeighborhood(profile)}
                </Text>

                {/* CEP */}
                {profile.cep ? (
                  <Text
                    style={[
                      styles.cepLine,
                      { color: "rgba(140,140,140,0.7)" },
                    ]}
                  >
                    CEP {profile.cep.replace(/(\d{5})(\d{3})/, "$1-$2")}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhum endereço cadastrado
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footerSection}>
          <View style={styles.footerBorder} />
          <Pressable
            onPress={handleEdit}
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
              {addressExists ? "Editar endereço" : "Adicionar endereço"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
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
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 27,
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
  cardTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 16,
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
  cepLine: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    marginTop: 2,
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
