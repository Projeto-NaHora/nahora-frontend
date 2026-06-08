import React from "react";
import { View, Text, Pressable, Image, Share, StyleSheet } from "react-native";

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
      <View style={styles.qrContainer}>
        {qrCodeBase64 ? (
          <Image
            source={{ uri: qrCodeBase64 }}
            style={styles.qrImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrPlaceholderText}>
              {"QR Code\nPix\n" + formatted}
            </Text>
          </View>
        )}
        <Text style={styles.qrHint}>Escaneie com qualquer banco</Text>
      </View>

      {/* Copia e Cola section */}
      <View>
        <Text style={styles.sectionTitle}>Copia e Cola</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText} selectable>
            {copiaCola}
          </Text>
        </View>
        <Pressable onPress={handleCopy} style={styles.copyButton}>
          <Text style={styles.copyButtonText}>Copiar código</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    backgroundColor: "#f8f9fa",
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
    color: "#a1a1aa",
    textAlign: "center",
    lineHeight: 19.25,
  },
  qrHint: {
    fontSize: 14,
    color: "#a1a1aa",
    marginTop: 16,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 16,
    lineHeight: 25.5,
  },
  codeBox: {
    borderWidth: 1,
    borderColor: "#eaeaea",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  codeText: {
    fontSize: 13,
    color: "#8c8c8c",
    fontFamily: "monospace",
    lineHeight: 21.13,
  },
  copyButton: {
    borderWidth: 2,
    borderColor: "#e67215",
    borderRadius: 16,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e67215",
  },
});
