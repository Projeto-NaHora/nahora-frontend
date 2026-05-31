// features/favorites/components/FavoriteCard.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import type { FavoritoResponseDTO } from "../types";

const AVATAR_COLORS: { bg: string; text: string }[] = [
  { bg: "#fef0e8", text: "#f26f21" },
  { bg: "#e6f0ff", text: "#417be0" },
  { bg: "#e8fef0", text: "#21a67a" },
  { bg: "#f5e8fe", text: "#7a41be" },
  { bg: "#fef5e8", text: "#e0a041" },
  { bg: "#e8f5fe", text: "#4196e0" },
];

function getAvatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

interface FavoriteCardProps {
  professional: FavoritoResponseDTO;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function FavoriteCard({
  professional,
  onPress,
  onToggleFavorite,
}: FavoriteCardProps) {
  const rating = professional.mediaAvaliacao ?? 0;
  const totalReviews = professional.totalAvaliacoes ?? 0;
  const avatarColors = getAvatarColor(professional.profissionalId);
  const categoriaLabel = professional.categorias?.[0] ?? "";

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* Avatar */}
      {professional.fotoProfissional ? (
        <Image
          source={{ uri: professional.fotoProfissional }}
          style={styles.avatar}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.avatar, { backgroundColor: avatarColors.bg }]}>
          <Text style={[styles.avatarText, { color: avatarColors.text }]}>
            {getInitials(professional.nomeProfissional)}
          </Text>
        </View>
      )}

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {professional.nomeProfissional}
        </Text>
        {categoriaLabel ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {categoriaLabel}
          </Text>
        ) : null}

        {/* Rating row */}
        <View style={styles.ratingRow}>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name="star"
                size={12}
                color="#ff9500"
                style={styles.starIcon}
              />
            ))}
          </View>
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          {totalReviews > 0 && (
            <Text style={styles.reviewCount}>
              · {totalReviews} avaliação{totalReviews !== 1 ? "ões" : "ão"}
            </Text>
          )}
        </View>
      </View>

      {/* Favorite toggle */}
      <TouchableOpacity
        style={styles.heartButton}
        onPress={onToggleFavorite}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <FontAwesome name="heart" size={24} color="#f26f21" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 32,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 17,
    fontFamily: "Inter",
    fontWeight: "700",
    lineHeight: 26.44,
    textAlign: "center",
  },
  infoContainer: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 17,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#1c1c1e",
    lineHeight: 21.25,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    color: "#8e8e93",
    lineHeight: 21,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingTop: 2,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
  starIcon: {},
  ratingText: {
    fontSize: 13,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#1c1c1e",
    lineHeight: 19.5,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 13,
    fontFamily: "Inter",
    fontWeight: "400",
    color: "#8e8e93",
    lineHeight: 19.5,
  },
  heartButton: {
    paddingLeft: 8,
  },
});
