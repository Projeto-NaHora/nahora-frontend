import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
// IMPORTAÇÃO CORRETA DA SAFE AREA (salva o Android!)
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

// Mock de dados do profissional (Adicionada a "categoria")
const mockProfessional = {
  id: "1",
  nome: "Mariana Souza",
  categoria: "Eletricista", // <-- Tipo do profissional adicionado aqui
  localizacao: "São Paulo, SP",
  nota: 4.8,
  experienciaAnos: 7,
  servicosRealizados: 152,
  especialidades: ["Elétrica", "Instalação de Ar", "Manutenção", "Pintura"],
  biografia:
    "Profissional dedicada com mais de 7 anos de experiência em serviços residenciais e comerciais. Prezo pela qualidade, pontualidade e satisfação do cliente. Atendo toda a região de São Paulo e arredores.",
  avatarUrl: "",
  portfolio: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    "https://images.unsplash.com/photo-1508873699372-7aeab60b44c1",
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
  ],
};

const AVATAR_SIZE = 96;
const STAR_SIZE = 20;
const PILL_COLOR = "#F6F6F6";
const ORANGE = "#FF7A00";
const GRAY = "#E0E0E0";
const DARK = "#222";
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ProfessionalProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const prof = mockProfessional;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const maxPortfolio = 5;
  const portfolioToShow = prof.portfolio.slice(0, maxPortfolio);
  const extraCount = prof.portfolio.length - maxPortfolio;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do Profissional</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Identidade */}
        <View style={styles.identityBlock}>
          {prof.avatarUrl ? (
            <Image
              source={{ uri: prof.avatarUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {getInitials(prof.nome)}
              </Text>
            </View>
          )}
          <Text style={styles.name}>{prof.nome}</Text>

          {/* Nova linha de Localização com a Categoria */}
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>
              {prof.categoria} - {prof.localizacao}
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
            <Text style={styles.ratingText}>{prof.nota.toFixed(1)}</Text>
          </View>
        </View>

        {/* Ações (Botões limpos e botão de opções adicionado) */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionPrimary}>
            <Text style={styles.actionPrimaryText}>Criar pedido</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionSecondary}>
            <Text style={styles.actionSecondaryText}>Ver agenda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionMore}>
            <Feather name="more-horizontal" size={20} color="#222" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{prof.experienciaAnos} anos</Text>
            <Text style={styles.statLabel}>Experiência</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{prof.servicosRealizados}</Text>
            <Text style={styles.statLabel}>Serviços</Text>
          </View>
        </View>

        {/* Especialidades */}
        <Text style={styles.sectionTitle}>Especialidades</Text>
        <View style={styles.pillsRow}>
          {prof.especialidades.map((esp, idx) => (
            <View key={esp + idx} style={styles.pill}>
              <Text style={styles.pillText}>{esp}</Text>
            </View>
          ))}
        </View>

        {/* Sobre */}
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.bioText}>{prof.biografia}</Text>

        {/* Portfólio */}
        <Text style={styles.sectionTitle}>Portfólio</Text>
        <View style={styles.portfolioGrid}>
          {portfolioToShow.map((url, idx) => {
            const isLast = idx === maxPortfolio - 1 && extraCount > 0;
            return (
              <View key={url + idx} style={styles.portfolioItem}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF",
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
    padding: 4,
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
  actionMore: {
    width: 48,
    borderWidth: 1,
    borderColor: GRAY,
    backgroundColor: "#FFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
