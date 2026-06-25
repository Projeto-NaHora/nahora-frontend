// features/notifications/components/NotificationCard.tsx
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Fonts } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { NotificacaoDTO } from "../types";
import type { TipoNotificacao } from "@/types/enums";

interface NotificationCardProps {
  notificacao: NotificacaoDTO;
  onPress: (notificacao: NotificacaoDTO) => void;
}

const iconMap: Record<TipoNotificacao, { name: string; label: string }> = {
  NOVO_PEDIDO: { name: "doc.text.fill", label: "Novo pedido" },
  NOVA_PROPOSTA: { name: "briefcase.fill", label: "Nova proposta" },
  PROPOSTA_ACEITA: { name: "briefcase.fill", label: "Proposta aceita" },
  NOVA_MENSAGEM: { name: "bubble.left.and.bubble.right.fill", label: "Mensagem" },
  SERVICO_CONCLUIDO: { name: "briefcase.fill", label: "Serviço concluído" },
  PAGAMENTO_LIBERADO: { name: "attach-money", label: "Pagamento" },
  DISPUTA_ABERTA: { name: "settings", label: "Disputa" },
  AVALIACAO_RECEBIDA: { name: "heart.fill", label: "Avaliação" },
  VERIFICACAO_APROVADA: { name: "person.fill", label: "Verificação" },
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function NotificationCard({ notificacao, onPress }: NotificationCardProps) {
  const icon = iconMap[notificacao.tipo] ?? { name: "edit", label: "Notificação" };

  const unreadDot = useMemo(
    () => !notificacao.lida,
    [notificacao.lida],
  );

  return (
    <Pressable
      onPress={() => onPress(notificacao)}
      style={({ pressed }) => [
        styles.container,
        !notificacao.lida && styles.unread,
        pressed && styles.pressed,
      ]}
    >
      {/* Icon */}
      <View style={styles.iconBox}>
        <IconSymbol
          name={icon.name as any}
          size={20}
          color={!notificacao.lida ? "#F97415" : "#8e8e93"}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.label} numberOfLines={1}>
            {icon.label}
          </Text>
          <Text style={styles.time}>{formatTime(notificacao.criadaEm)}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {notificacao.titulo}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {notificacao.mensagem}
        </Text>
      </View>

      {/* Unread dot */}
      {unreadDot && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
  },
  unread: {
    backgroundColor: "#fff9f2",
  },
  pressed: {
    opacity: 0.7,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  label: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: "600",
    color: "#F97415",
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: "#b0b0b0",
  },
  title: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 2,
  },
  body: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: "#8e8e93",
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F97415",
    marginTop: 16,
    marginLeft: 8,
  },
});