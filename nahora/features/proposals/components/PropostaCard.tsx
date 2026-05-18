import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import type { Proposta } from "@/features/proposals/types";
import { CATEGORIA_LABEL } from "@/features/orders/types";
import { getInitials } from "@/utils/formatters";

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
  onVerPerfil: () => void;
}

function getCategoriaLabel(proposta: Proposta): string | null {
  const prof = proposta.profissional;
  if (prof.especialidades?.length) return prof.especialidades[0];
  if (prof.categoriasAtendidas?.length) return CATEGORIA_LABEL[prof.categoriasAtendidas[0]] ?? prof.categoriasAtendidas[0];
  return null;
}

export function PropostaCard({
  proposta,
  destacada,
  onNegociar,
  onVerPerfil,
}: PropostaCardProps) {
  const iniciais = getInitials(proposta.profissional.nome);
  const avatarColor = getAvatarColor(proposta.profissional.nome);
  const categoria = getCategoriaLabel(proposta);
  const localidade = proposta.profissional.localidade;
  const subtitulo = [categoria, localidade].filter(Boolean).join(" · ");

  return (
    <View
      style={[
        styles.card,
        destacada ? styles.cardDestacada : styles.cardNormal,
      ]}
    >
      {destacada && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>MELHOR AVALIADO</Text>
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
            <Text style={styles.avatarText}>{iniciais}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{proposta.profissional.nome}</Text>
          {subtitulo ? (
            <Text style={styles.subtitle}>{subtitulo}</Text>
          ) : null}
        </View>

        <Text style={styles.price}>R$ {(proposta.valor ?? 0).toFixed(0)}</Text>
      </View>

      {proposta.descricao ? (
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText} numberOfLines={4}>
            &ldquo;{proposta.descricao}&rdquo;
          </Text>
        </View>
      ) : null}

      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          {proposta.profissional.totalServicosExecutados} serviços feitos
        </Text>
        {proposta.profissional.distancia != null && (
          <>
            <Text style={styles.statsText}>·</Text>
            <Text style={styles.statsText}>
              {proposta.profissional.distancia} km de você
            </Text>
          </>
        )}
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={onNegociar}>
          <Text style={styles.primaryButtonText}>Negociar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={onVerPerfil}>
          <Text style={styles.secondaryButtonText}>Ver perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
  },
  cardNormal: {
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  cardDestacada: {
    borderWidth: 2,
    borderColor: "#f97316",
  },
  badge: {
    position: "absolute",
    top: 0,
    left: 20,
    backgroundColor: "#f27b24",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#ffffff",
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
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111111",
  },
  subtitle: {
    fontSize: 13,
    color: "#8c8c8c",
  },
  price: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1aae6f",
  },
  quoteBox: {
    backgroundColor: "#f8f9fa",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 16,
  },
  quoteText: {
    fontSize: 14,
    color: "#4a5568",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  statsText: {
    fontSize: 13,
    color: "#8c8c8c",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#f27b24",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },
});
