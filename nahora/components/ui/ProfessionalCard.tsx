import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SuggestedProfessional } from "../../store/homeStore";

type Props = {
  // Usamos 'any' aqui internamente apenas para garantir que ele aceite o mapeamento novo sem conflitar com o Store antigo
  professional: any;
};

export const ProfessionalCard: React.FC<Props> = ({ professional }) => {
  // Extração segura das variáveis (aceita tanto o padrão em Inglês quanto o antigo em Português)
  const name = professional?.name || professional?.nome || "Sem Nome";
  const category =
    professional?.category || professional?.categoria || "Serviços";
  const rating = Number(professional?.rating ?? professional?.notaMedia ?? 0);
  const reviews = professional?.reviews ?? professional?.totalAvaliacoes ?? 0;
  const isPlus =
    professional?.isPlus ||
    professional?.badgePlus ||
    professional?.planoPlus ||
    false;
  const avatarUrl = professional?.avatarUrl || professional?.foto || null;

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {/* Renderização condicional da foto, igual fizemos na busca */}
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.imagePlaceholder}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <FontAwesome name="user-circle" size={56} color="#A3A3A3" />
          </View>
        )}
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      <Text style={styles.category} numberOfLines={1}>
        {category}
      </Text>

      <View style={styles.ratingContainer}>
        <FontAwesome name="star" size={14} color="#FACC15" />
        <Text style={styles.ratingScore}>{rating.toFixed(1)}</Text>
        <Text style={styles.ratingCount}>({reviews})</Text>
      </View>

      {isPlus && (
        <View style={styles.badgePlus}>
          <Text style={styles.badgePlusText}>Plus</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: 144, // aprox w-36
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  category: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Garante que a nota fique centralizada
    marginBottom: 4,
  },
  ratingScore: {
    fontSize: 12,
    color: "#374151",
    marginLeft: 4,
    fontWeight: "500",
  },
  ratingCount: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 4,
  },
  badgePlus: {
    backgroundColor: "#FF9800", // Atualizado para a mesma cor Laranja do "Plus" da busca
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    marginTop: 4,
  },
  badgePlusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
});

export default ProfessionalCard;
