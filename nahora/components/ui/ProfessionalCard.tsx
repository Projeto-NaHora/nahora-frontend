import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SuggestedProfessional } from "../../store/homeStore";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

type Props = {
  // Usamos 'any' aqui internamente apenas para garantir que ele aceite o mapeamento novo sem conflitar com o Store antigo
  professional: any;
  onPress?: () => void;
};

export const ProfessionalCard: React.FC<Props> = ({ professional, onPress }) => {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

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
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.imageContainer}>
        {/* Renderização condicional da foto, igual fizemos na busca */}
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.imagePlaceholder}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface }]}>
            <FontAwesome name="user-circle" size={56} color={colors.icon} />
          </View>
        )}
      </View>

      <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
        {name}
      </Text>

      <Text style={[styles.category, { color: colors.textSecondary }]} numberOfLines={1}>
        {category}
      </Text>

      <View style={styles.ratingContainer}>
        <FontAwesome name="star" size={14} color="#FACC15" />
        <Text style={[styles.ratingScore, { color: colors.text }]}>{rating.toFixed(1)}</Text>
        <Text style={[styles.ratingCount, { color: colors.textSecondary }]}>({reviews})</Text>
      </View>

      {isPlus && (
        <View style={[styles.badgePlus, { backgroundColor: colors.brand }]}>
          <Text style={[styles.badgePlusText, { color: colors.onBrand }]}>Plus</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: 144,
    marginHorizontal: 4,
    borderWidth: 1,
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
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  category: {
    fontSize: 12,
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
    marginLeft: 4,
    fontWeight: "500",
  },
  ratingCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  badgePlus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    marginTop: 4,
  },
  badgePlusText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default ProfessionalCard;
