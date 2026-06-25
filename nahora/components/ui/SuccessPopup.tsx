import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { Fonts} from "@/constants/theme";

interface SuccessPopupProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

export function SuccessPopup({ visible, message, onDismiss }: SuccessPopupProps) {
  const scale = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      backdropOpacity.set(withTiming(0.4, { duration: 250 }));
      scale.set(withSpring(1, { damping: 12, stiffness: 200 }));
    } else {
      scale.set(0);
      backdropOpacity.set(0);
    }
  }, [visible]); // eslint-disable-line react-doctor/exhaustive-deps — shared values are stable

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleDismiss = () => {
    backdropOpacity.set(withTiming(0, { duration: 200 }));
    scale.set(withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        onDismiss();
      }
    }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleDismiss}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.backdrop, animatedBackdropStyle]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={handleDismiss} />
        </Animated.View>

        <Animated.View
          style={[styles.card, animatedCardStyle]}
        >
          {/* Checkmark icon */}
          <View style={styles.iconCircle}>
            <Text style={{ fontSize: 32, color: "#F97415", lineHeight: 36 }}>
              ✓
            </Text>
          </View>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* OK button */}
          <Pressable
            onPress={handleDismiss}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    width: 280,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff5e6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  message: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    color: "#111111",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    height: 48,
    paddingHorizontal: 40,
    borderRadius: 24,
    backgroundColor: "#F97415",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
