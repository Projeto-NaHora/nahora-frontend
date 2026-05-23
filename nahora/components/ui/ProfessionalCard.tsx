import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SuggestedProfessional } from "../../store/homeStore";

type Props = {
  professional: SuggestedProfessional;
};

export const ProfessionalCard: React.FC<Props> = ({ professional }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <FontAwesome name="user-circle" size={56} color="#A3A3A3" />
        </View>
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {professional.nome}
      </Text>

      <Text style={styles.category} numberOfLines={1}>
        {professional.categoria}
      </Text>

      <View style={styles.ratingContainer}>
        <FontAwesome name="star" size={14} color="#FACC15" />
        <Text style={styles.ratingScore}>
          {professional.notaMedia.toFixed(1)}
        </Text>
        <Text style={styles.ratingCount}>({professional.totalAvaliacoes})</Text>
      </View>

      {professional.isPlus && (
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
    marginBottom: 4,
  },
  ratingScore: {
    fontSize: 12,
    color: "#374151",
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 4,
  },
  badgePlus: {
    backgroundColor: "#FACC15",
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
