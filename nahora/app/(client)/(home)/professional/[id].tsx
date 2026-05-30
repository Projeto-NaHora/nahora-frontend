import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { api } from "@/services/api/client";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { useFavoriteStatus } from "@/features/favorites/hooks/useFavoriteStatus";
import { Snackbar } from "@/components/ui/Snackbar";

const AVATAR_SIZE = 96;
const STAR_SIZE = 20;
const PILL_COLOR = "#F6F6F6";
const ORANGE = "#FF7A00";
const GRAY = "#E0E0E0";
const DARK = "#222";
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ProfessionalProfileScreen() {
  const { id } = useLocalSearchParams();
  const profissionalId = Number(id);
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  // Favoritos
  const {
    isFavorite,
    isLoading: isFavoriteLoading,
    toggle,
    snackbar,
    dismissSnackbar,
  } = useFavoriteStatus(profissionalId);

  // Função segura para voltar
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Se não houver histórico, força a volta para a home
      router.push("/(client)/(home)");
    }
  };

  // Estados para gerenciar os dados da API
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Busca os dados do profissional assim que a tela abre
  useEffect(() => {
    async function fetchProfessionalProfile() {
      if (!id) return;

      try {
        setIsLoading(true);
        // Chama o endpoint de perfil do seu backend
        const response = await api.get(`/profissionais/${id}`);
        setProfileData(response.data);
      } catch (error) {
        console.error("Erro ao buscar perfil do profissional:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfessionalProfile();
  }, [id]);

  const getInitials = (name: string) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Tela de Carregamento
  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.safe,
          styles.centerContent,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Carregando perfil...
        </Text>
      </SafeAreaView>
    );
  }

  // Tela de Erro (se a API falhar ou o ID não existir)
  if (!profileData) {
    return (
      <SafeAreaView
        style={[
          styles.safe,
          styles.centerContent,
          { backgroundColor: colors.background },
        ]}
      >
        <Feather name="user-x" size={48} color={colors.textSecondary} />
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          Profissional não encontrado.
        </Text>
        <TouchableOpacity
          style={[styles.errorBtn, { backgroundColor: colors.brand }]}
          onPress={handleGoBack}
        >
          <Text style={[styles.errorBtnText, { color: colors.onBrand }]}>
            Voltar
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const rawCidade = profileData.cidade || "";
  const cleanCidade = rawCidade
    .replace(/null/gi, "") // Tira o "null"
    .replace(/^[,\s]+|[,\s]+$/g, "") // Tira vírgulas soltas no início ou fim
    .trim();

  // Mapeamento dos dados do Backend (ProfissionalPerfilDTO) para o formato da tela
  const prof = {
    nome: profileData.nome || "Sem Nome",
    categoria: profileData.categoriaNome || "Profissional",
    cidade: cleanCidade || "Localização não informada",
    nota: profileData.mediaAvaliacoes ?? 0,
    experienciaAnos: profileData.anosExperiencia ?? 0,
    servicosRealizados: profileData.totalServicosExecutados ?? 0,
    descricaoEspecialidades:
      profileData.especialidadesDescricao ||
      "Não foi informada uma descrição das especialidades.",
    especialidades: profileData.especialidadesTags || [],
    biografia:
      profileData.sobreDescricao ||
      "Este profissional ainda não adicionou uma biografia.",
    avatarUrl: profileData.foto || null,
    portfolio: profileData.portfolioFotos || [],
    totalPortfolio: profileData.totalPortfolioFotos || 0,
  };

  const maxPortfolio = 5;
  const portfolioToShow = prof.portfolio.slice(0, maxPortfolio);
  // Calcula quantos itens extras existem além dos mostrados
  const extraCount =
    prof.totalPortfolio > portfolioToShow.length
      ? prof.totalPortfolio - portfolioToShow.length
      : 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backBtn}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Perfil do Profissional
        </Text>
        <FavoriteButton
          profissionalId={profissionalId}
          isFavorite={isFavorite}
          isLoading={isFavoriteLoading}
          onToggle={toggle}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Identidade */}
        <View style={styles.identityBlock}>
          {prof.avatarUrl ? (
            <Image
              source={{ uri: prof.avatarUrl }}
              style={[styles.avatar, { backgroundColor: colors.surface }]}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.avatarInitials, { color: colors.brand }]}>
                {getInitials(prof.nome)}
              </Text>
            </View>
          )}
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {prof.nome}
          </Text>

          <View style={styles.locationRow}>
            <Text
              style={[styles.locationText, { color: colors.textSecondary }]}
            >
              {prof.categoria} - {prof.cidade}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <MaterialCommunityIcons
                key={i}
                name={
                  prof.nota >= i + 1
                    ? "star"
                    : prof.nota > i
                      ? "star-half-full"
                      : "star-outline"
                }
                size={STAR_SIZE}
                color="#FFD600"
              />
            ))}
            <Text style={[styles.ratingText, { color: colors.textPrimary }]}>
              {prof.nota.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionPrimary, { backgroundColor: colors.brand }]}
          >
            <Text style={[styles.actionPrimaryText, { color: colors.onBrand }]}>
              Criar pedido
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionSecondary,
              {
                borderColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
          >
            <Text style={[styles.actionSecondaryText, { color: colors.brand }]}>
              Ver agenda
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statBlock, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {prof.experienciaAnos} anos
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Experiência
            </Text>
          </View>
          <View style={[styles.statBlock, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {prof.servicosRealizados}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Serviços
            </Text>
          </View>
        </View>

        {/* Especialidades */}
        {prof.especialidades.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Especialidades
            </Text>
            <Text style={[styles.bioText, { color: colors.textPrimary }]}>
              {prof.descricaoEspecialidades}
            </Text>
            <View style={styles.pillsRow}>
              {prof.especialidades.map((esp: string, idx: number) => (
                <View
                  key={esp + idx}
                  style={[styles.pill, { backgroundColor: colors.surface }]}
                >
                  <Text
                    style={[styles.pillText, { color: colors.textSecondary }]}
                  >
                    {esp}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Sobre */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Sobre
        </Text>
        <Text style={[styles.bioText, { color: colors.textPrimary }]}>
          {prof.biografia}
        </Text>

        {/* Portfólio */}
        {prof.portfolio.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Portfólio
            </Text>
            <View style={styles.portfolioGrid}>
              {portfolioToShow.map((url: string, idx: number) => {
                const isLast = idx === maxPortfolio - 1 && extraCount > 0;
                return (
                  <View
                    key={url + idx}
                    style={[
                      styles.portfolioItem,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <Image source={{ uri: url }} style={styles.portfolioImg} />
                    {isLast && (
                      <View style={styles.overlay}>
                        <Text style={styles.overlayText}>+{extraCount}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {/* Snackbar para feedback de favoritar/desfavoritar */}
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        isError={snackbar.isError}
        onDismiss={dismissSnackbar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: "#444",
    fontWeight: "500",
  },
  errorBtn: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: ORANGE,
    borderRadius: 8,
  },
  errorBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    justifyContent: "space-between",
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: DARK,
    flex: 1,
    textAlign: "center",
    marginLeft: -24,
  },
  scroll: {
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  identityBlock: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: PILL_COLOR,
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: PILL_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: "700",
    color: ORANGE,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: DARK,
    marginTop: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    color: "#888",
    fontSize: 15,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#444",
    fontSize: 16,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 8,
    gap: 8,
  },
  actionPrimary: {
    flex: 1,
    backgroundColor: ORANGE,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  actionPrimaryText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
  actionSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: GRAY,
    backgroundColor: "#FFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  actionSecondaryText: {
    color: ORANGE,
    fontWeight: "700",
    fontSize: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    marginTop: 4,
  },
  statBlock: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: PILL_COLOR,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: DARK,
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: DARK,
    marginTop: 18,
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  pill: {
    backgroundColor: PILL_COLOR,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  pillText: {
    color: "#666",
    fontWeight: "500",
    fontSize: 14,
  },
  bioText: {
    color: "#444",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  portfolioGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 4,
  },
  portfolioItem: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#EEE",
    position: "relative",
  },
  portfolioImg: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(34,34,34,0.60)",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 22,
  },
});
