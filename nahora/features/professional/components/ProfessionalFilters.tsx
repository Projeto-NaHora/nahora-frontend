// features/professional/components/ProfessionalFilters.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { CATEGORIA_LABEL } from "@/features/orders/types";
import type { CategoriaFilter, UrgenciaFilter } from "../types";

interface ProfessionalFiltersProps {
  selectedCategoria: CategoriaFilter;
  onSelectCategoria: (value: CategoriaFilter) => void;
  selectedUrgencia: UrgenciaFilter;
  onSelectUrgencia: (value: UrgenciaFilter) => void;
}

const CATEGORIAS: CategoriaFilter[] = [
  "TODAS",
  "ELETRICA",
  "PEDREIRO",
  "ENCANAMENTO",
  "PINTURA",
  "AR_CONDICIONADO",
];

const URGENCIAS: { value: UrgenciaFilter; label: string }[] = [
  { value: "TODAS", label: "Todas urgências" },
  { value: "URGENTE", label: "Urgente" },
  { value: "NORMAL", label: "Normal" },
];

export function ProfessionalFilters({
  selectedCategoria,
  onSelectCategoria,
  selectedUrgencia,
  onSelectUrgencia,
}: ProfessionalFiltersProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <View>
      {/* Category filters */}
      <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
        Categoria
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIAS.map((cat) => {
          const isActive = cat === selectedCategoria;
          const label =
            cat === "TODAS" ? "Todas as áreas" : CATEGORIA_LABEL[cat];
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                { backgroundColor: colors.surface, borderColor: colors.border },
                isActive && styles.chipActive,
              ]}
              activeOpacity={0.7}
              onPress={() => onSelectCategoria(cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: colors.textPrimary },
                  isActive && styles.chipTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Urgency filters */}
      <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
        Urgência
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.urgencyScroll}
      >
        {URGENCIAS.map((u) => {
          const isActive = u.value === selectedUrgencia;
          return (
            <TouchableOpacity
              key={u.value}
              style={[
                styles.chip,
                { backgroundColor: colors.surface, borderColor: colors.border },
                isActive && styles.urgencyChipActive,
              ]}
              activeOpacity={0.7}
              onPress={() => onSelectUrgencia(u.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: colors.textPrimary },
                  isActive && styles.urgencyChipTextActive,
                ]}
              >
                {u.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterLabel: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingLeft: 0,
    paddingTop: 16,
    paddingBottom: 4,
  },
  categoryScroll: {
    gap: 8,
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 0,
  },
  urgencyScroll: {
    gap: 8,
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 0,
    paddingTop: 8,
  },
  chip: {
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: "#E66A20",
    borderColor: "#E66A20",
  },
  chipText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  urgencyChipActive: {
    backgroundColor: "#FFF1E6",
    borderColor: "#E66A20",
  },
  urgencyChipTextActive: {
    color: "#E66A20",
    fontWeight: "700",
  },
});
