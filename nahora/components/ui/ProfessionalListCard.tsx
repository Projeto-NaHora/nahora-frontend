import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

type ProfessionalListCardProps = {
  name: string;
  category: string;
  distance: number; // em km
  rating: number;
  avatarUrl?: string | null;
  reviews: number;
  price: number;
  isPlus?: boolean;
  onPress?: () => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const ProfessionalListCard: React.FC<ProfessionalListCardProps> = ({
  name,
  category,
  distance,
  avatarUrl,
  rating,
  reviews,
  price,
  isPlus,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(name)}</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {isPlus && (
            <View style={styles.plusBadge}>
              <Text style={styles.plusText}>Plus</Text>
            </View>
          )}
        </View>

        {/*Categoria • X km */}
        <Text style={styles.categoryDistance} numberOfLines={1}>
          {category} <Text style={styles.dot}>•</Text> {distance.toFixed(1)} km
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.ratingRow}>
            <Feather
              name="star"
              size={14}
              color="#FFA726"
              style={{ marginRight: 2 }}
            />
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>
              <Text style={styles.dot}>•</Text> {reviews} aval.{" "}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AVATAR_BG = "#F3E8FF";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 0,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: AVATAR_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#7C3AED",
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 1,
  },
  info: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#22223B",
    maxWidth: "80%", // Previne que nomes muito longos empurrem a badge pra fora da tela
  },
  plusBadge: {
    backgroundColor: "#FFF7ED", // Fundo laranjinha claro
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  plusText: {
    color: "#F97316", // Laranja forte
    fontSize: 11,
    fontWeight: "bold",
  },
  categoryDistance: {
    color: "#6B7280",
    fontSize: 13,
    marginBottom: 4, // Um pouco mais de espaço embaixo
  },
  dot: {
    fontWeight: "bold",
    color: "#D1D5DB", // Pontinho um pouco mais claro
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    justifyContent: "space-between",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  rating: {
    color: "#22223B",
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 2,
  },
  reviews: {
    color: "#6B7280",
    fontSize: 12,
    marginLeft: 4,
  },
  price: {
    color: "#7C3AED",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 12,
  },
});

export default ProfessionalListCard;
