import React from "react";
import { View, Text,StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import type { Proposta } from "@/features/proposals/types";
import { CATEGORIA_LABEL } from "@/features/orders/types";
import { getInitials } from "@/utils/formatters";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const AVATAR_COLORS = ["#f27b24", "#0277bd", "#2e7d32", "#7c3aed", "#c62828"];

function getAvatarColor(nome: string): string {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface PropostaCardProps {
  proposta: Proposta;
  destacada: boolean;
  onNegociar: () => void;
  onVerProposta: () => void;
  onVerPerfil: () => void;
}

function getCategoriaLabel(proposta: Proposta): string | null {
  const prof = proposta.profissional;
  if (prof.especialidades?.length) return prof.especialidades[0];
  if (prof.categoriasAtendidas?.length)
    return (
      CATEGORIA_LABEL[prof.categoriasAtendidas[0]] ??
      prof.categoriasAtendidas[0]
    );
  return null;
}

export function PropostaCard({
  proposta,
  destacada,
  onNegociar,
  onVerProposta,
  onVerPerfil,
}: PropostaCardProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const iniciais = getInitials(proposta.profissional.nome);
  const avatarColor = getAvatarColor(proposta.profissional.nome);
  const categoria = getCategoriaLabel(proposta);
  const localidade = proposta.profissional.localidade;
  const subtitulo = [categoria, localidade].filter(Boolean).join(" · ");

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.background },
        destacada
          ? { borderWidth: 2, borderColor: colors.brand }
          : { borderWidth: 1, borderColor: colors.border },
      ]}
    >
      {destacada && (
        <View style={[styles.badge, { backgroundColor: colors.brand }]}>
          <Text style={[styles.badgeText, { color: colors.onBrand }]}>
            MELHOR AVALIADO
          </Text>
        </View>
      )}

      <View style={styles.row}>
        <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
          {proposta.profissional.foto ? (
            <Image
              source={{ uri: proposta.profissional.foto }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={[styles.avatarText, { color: colors.onBrand }]}>
              {iniciais}
            </Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {proposta.profissional.nome}
          </Text>
          {subtitulo ? (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {subtitulo}
            </Text>
          ) : null}
          <Pressable onPress={onVerPerfil}>
            <Text style={[styles.verPerfilText, { color: colors.brand }]}>
              Ver perfil
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.price, { color: colors.success }]}>
          R$ {(proposta.valor ?? 0).toFixed(0)}
        </Text>
      </View>

      {proposta.descricao ? (
        <View style={[styles.quoteBox, { backgroundColor: colors.surface }]}>
          <Text
            style={[styles.quoteText, { color: colors.textSecondary }]}
            numberOfLines={4}
          >
            &ldquo;{proposta.descricao}&rdquo;
          </Text>
        </View>
      ) : null}

      <View style={styles.statsRow}>
        <Text style={[styles.statsText, { color: colors.textSecondary }]}>
          {proposta.profissional.totalServicosExecutados} serviços feitos
        </Text>
        {proposta.profissional.distancia != null && (
          <>
            <Text style={[styles.statsText, { color: colors.textSecondary }]}>
              ·
            </Text>
            <Text style={[styles.statsText, { color: colors.textSecondary }]}>
              {proposta.profissional.distancia} km de você
            </Text>
          </>
        )}
      </View>

      <View style={styles.buttonsRow}>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: colors.brand }]}
          onPress={onNegociar}
        >
          <Text style={[styles.primaryButtonText, { color: colors.onBrand }]}>
            Negociar
          </Text>
        </Pressable>
        <Pressable
          style={[styles.secondaryButton, { backgroundColor: colors.surface }]}
          onPress={onVerProposta}
        >
          <Text
            style={[styles.secondaryButtonText, { color: colors.textPrimary }]}
          >
            Ver proposta
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
  },
  badge: {
    position: "absolute",
    top: 0,
    left: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarText: {
    fontSize: 17,
    fontWeight: "700",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
  },
  verPerfilText: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  price: {
    fontSize: 12,
    fontWeight: "700",
  },
  quoteBox: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 16,
  },
  quoteText: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  statsText: {
    fontSize: 13,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
