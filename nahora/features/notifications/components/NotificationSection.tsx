// features/notifications/components/NotificationSection.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Fonts } from "@/constants/theme";
import { NotificationCard } from "./NotificationCard";
import type { NotificacaoDTO } from "../types";

interface NotificationSectionProps {
  secao: string;
  notificacoes: NotificacaoDTO[];
  onPress: (n: NotificacaoDTO) => void;
}

export function NotificationSection({
  secao,
  notificacoes,
  onPress,
}: NotificationSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{secao}</Text>
      {notificacoes.map((notificacao) => (
        <React.Fragment key={notificacao.id}>
          <NotificationCard notificacao={notificacao} onPress={onPress} />
          <View style={styles.divider} />
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: "700",
    color: "#1c1c1e",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 20,
  },
});