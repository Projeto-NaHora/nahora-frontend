import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

type ProfessionalListCardProps = {
  name: string;
  category: string;
  distance: number; // em km
  rating: number;
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
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(name)}</Text>
        </View>
      </View>
      {/* Info */}
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {isPlus && (
            <View style={styles.plusBadge}>
              <MaterialCommunityIcons name="star" size={14} color="#fff" />
              <Text style={styles.plusText}>Plus</Text>
            </View>
          )}
        </View>
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
            <Text style={styles.reviews}>({reviews})</Text>
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
    maxWidth: "80%",
  },
  plusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    gap: 2,
  },
  plusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 2,
  },
  categoryDistance: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 2,
  },
  dot: {
    fontWeight: "bold",
    color: "#BDBDBD",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    justifyContent: "space-between",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  rating: {
    color: "#22223B",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 2,
  },
  reviews: {
    color: "#6B7280",
    fontSize: 13,
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
