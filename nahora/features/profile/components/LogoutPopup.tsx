import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

interface LogoutPopupProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutPopup({
  visible,
  onConfirm,
  onCancel,
}: LogoutPopupProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={styles.sheet}>
          {/* Ícone */}
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <IconSymbol name={"close" as any} size={26} color="#e02424" />
            </View>
          </View>

          {/* Título */}
          <Text style={styles.title}>Sair do aplicativo?</Text>

          {/* Descrição */}
          <Text style={styles.description}>
            Tem certeza que deseja sair da sua conta? Você{"\n"}
            precisará fazer login novamente para solicitar{"\n"}
            serviços.
          </Text>

          {/* Botões */}
          <View style={styles.buttons}>
            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.confirmButtonText}>Sair da conta</Text>
            </Pressable>

            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 10,
  },
  iconWrapper: {
    alignItems: "center",
    paddingBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: Fonts?.sans,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 27.5,
    color: "#111111",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 24.38,
    color: "#8c8c8c",
    textAlign: "center",
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  buttons: {
    gap: 12,
  },
  confirmButton: {
    height: 56,
    borderRadius: 24,
    backgroundColor: "#e02424",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    color: "#ffffff",
  },
  cancelButton: {
    height: 56,
    borderRadius: 24,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    color: "#111111",
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
