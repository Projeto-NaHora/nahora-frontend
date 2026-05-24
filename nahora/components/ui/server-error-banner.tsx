import React from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";

import { Colors, Fonts, FontSizes, LetterSpacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ServerErrorBannerProps = {
  /** Título do banner. Padrão: "Erro ao salvar" */
  title?: string;
  /** Mensagem descritiva do erro (obrigatória) */
  message: string;
  /** Código HTTP do erro (ex.: 400, 401, 500). Exibido como tag no banner. */
  statusCode?: number;
  /** Estilos adicionais aplicados ao container do banner */
  style?: ViewStyle;
};

/**
 * Banner de erro de servidor usado em formulários e fluxos de autenticação.
 *
 * Segue o design system do Figma:
 * - Fundo vermelho claro (#FEE2E2 a 50%) com borda vermelha
 * - Ícone circular com "!" no canto esquerdo
 * - Título em negrito e mensagem descritiva
 */
export function ServerErrorBanner({
  title = "Erro ao salvar",
  message,
  statusCode,
  style,
}: ServerErrorBannerProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const errorColor = colors.error;

  return (
    <View style={[styles.container, { borderColor: errorColor + "80" }, style]}>
      {/* Ícone */}
      <View style={styles.iconWrapper}>
        <View style={[styles.iconCircle, { borderColor: errorColor }]}>
          <Text style={[styles.iconExclamation, { color: errorColor }]}>!</Text>
        </View>
      </View>

      {/* Conteúdo textual */}
      <View style={styles.content}>
        {/* Linha do título + badge de status */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: errorColor }]}>{title}</Text>
          {statusCode && (
            <View style={[styles.statusBadge, { borderColor: errorColor }]}>
              <Text style={[styles.statusBadgeText, { color: errorColor }]}>
                {statusCode}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.message, { color: errorColor + "CC" }]}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 14,
    padding: 18,
    borderRadius: 27,
    borderWidth: 1,
    backgroundColor: "rgba(254, 226, 226, 0.5)",
  },
  iconWrapper: {
    paddingTop: 2,
  },
  iconCircle: {
    width: 23,
    height: 23,
    borderRadius: 11.5,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  iconExclamation: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 17,
  },
  content: {
    flex: 1,
    gap: 5,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
  },
  title: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
    letterSpacing: LetterSpacing.title,
  },
  message: {
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.body,
    fontWeight: "400",
    lineHeight: 22,
    letterSpacing: LetterSpacing.body,
  },
});
