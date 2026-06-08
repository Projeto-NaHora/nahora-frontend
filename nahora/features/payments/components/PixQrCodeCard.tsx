import React from "react";
import { View, Text, Pressable, Image, Share, StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

interface PixQrCodeCardProps {
  qrCodeBase64: string;
  copiaCola: string;
  valor: number;
}

export function PixQrCodeCard({
  qrCodeBase64,
  copiaCola,
  valor,
}: PixQrCodeCardProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const handleCopy = async () => {
    try {
      await Share.share({ message: copiaCola });
    } catch {
      // usuário cancelou
    }
  };

  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

  return (
    <View>
      {/* QR Code area */}
      <View style={[styles.qrContainer, { backgroundColor: colors.surface }]}>
        {qrCodeBase64 ? (
          <Image
            source={{ uri: qrCodeBase64 }}
            style={styles.qrImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.qrPlaceholder}>
            <Text style={[styles.qrPlaceholderText, { color: colors.textSecondary }]}>
              {"QR Code\nPix\n" + formatted}
            </Text>
          </View>
        )}
        <Text style={[styles.qrHint, { color: colors.textSecondary }]}>Escaneie com qualquer banco</Text>
      </View>

      {/* Copia e Cola section */}
      <View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Copia e Cola</Text>
        <View style={[styles.codeBox, { borderColor: colors.border }]}>
          <Text style={[styles.codeText, { color: colors.textSecondary }]} selectable>
            {copiaCola}
          </Text>
        </View>
        <Pressable onPress={handleCopy} style={[styles.copyButton, { borderColor: colors.brand, backgroundColor: colors.background }]}>
          <Text style={[styles.copyButtonText, { color: colors.brand }]}>Copiar código</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 24,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  qrPlaceholder: {
    alignItems: "center",
  },
  qrPlaceholderText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 19.25,
  },
  qrHint: {
    fontSize: 14,
    marginTop: 16,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 16,
    lineHeight: 25.5,
  },
  codeBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  codeText: {
    fontSize: 13,
    fontFamily: "monospace",
    lineHeight: 21.13,
  },
  copyButton: {
    borderWidth: 2,
    borderRadius: 16,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
