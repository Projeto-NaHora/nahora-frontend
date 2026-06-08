import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Fonts } from "@/constants/theme";

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
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        // Dissolve do backdrop: fade in de 0 → 0.4
        Animated.timing(backdropOpacity, {
          toValue: 0.4,
          duration: 300,
          useNativeDriver: true,
        }),
        // Slide-up da sheet
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      backdropOpacity.setValue(0);
      sheetTranslateY.setValue(600);
    }
  }, [visible, backdropOpacity, sheetTranslateY]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Backdrop com fade-in (dissolve) */}
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        </Animated.View>

        {/* Sheet com slide-up */}
        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: colors.background, transform: [{ translateY: sheetTranslateY }] },
          ]}
        >
          {/* Ícone */}
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <IconSymbol name={"close" as any} size={26} color={colors.error} />
            </View>
          </View>

          {/* Título */}
          <Text style={[styles.title, { color: colors.text }]}>Sair do aplicativo?</Text>

          {/* Descrição */}
          <Text style={[styles.description, { color: colors.textSecondary }]}>
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
                { backgroundColor: colors.error },
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={[styles.confirmButtonText, { color: colors.onBrand }]}>Sair da conta</Text>
            </Pressable>

            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                styles.cancelButton,
                { backgroundColor: colors.surface },
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancelar</Text>
            </Pressable>
          </View>
        </Animated.View>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  sheet: {
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
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 24.38,
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
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  cancelButton: {
    height: 56,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
