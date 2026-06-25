// features/favorites/components/FavoriteButton.tsx
import React from "react";
import { ActivityIndicator, StyleSheet, Pressable } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuthStore } from "@/store/authStore";

interface FavoriteButtonProps {
  profissionalId: number;
  isFavorite: boolean | undefined;
  isLoading: boolean;
  onToggle: () => void;
}

export function FavoriteButton({
  profissionalId: _profissionalId,
  isFavorite,
  isLoading,
  onToggle,
}: FavoriteButtonProps) {
  const user = useAuthStore((s) => s.user);

  // Oculta o botão para profissionais logados
  if (user?.tipo === "PROFISSIONAL") {
    return null;
  }

  // Loading state — mostra um ActivityIndicator no lugar do ícone
  if (isLoading) {
    return (
      <Pressable style={styles.button} disabled>
        <ActivityIndicator size={22} color="#f26f21" />
      </Pressable>
    );
  }

  return (
    <Pressable
      style={styles.button}
      onPress={onToggle}
    >
      <IconSymbol
        name="heart.fill"
        size={22}
        color={isFavorite ? "#f26f21" : "#CCCCCC"}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});
