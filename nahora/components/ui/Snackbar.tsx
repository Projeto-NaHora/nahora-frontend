// components/ui/Snackbar.tsx
import React, { useEffect, useRef } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Text, StyleSheet, Pressable } from "react-native";

interface SnackbarProps {
  visible: boolean;
  message: string;
  isError?: boolean;
  duration?: number;
  onDismiss: () => void;
}

export function Snackbar({
  visible,
  message,
  isError = false,
  duration = 3000,
  onDismiss,
}: SnackbarProps) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep latest onDismiss callback without reading/writing refs during render
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  const hide = () => {
    translateY.set(withTiming(100, { duration: 200 }));
    opacity.set(withTiming(0, { duration: 200 }));
    // Fire onDismiss after the hide animation finishes
    setTimeout(() => onDismissRef.current(), 200);
  };

  useEffect(() => {
    if (visible) {
      // Show: animate in
      translateY.set(withTiming(0, { duration: 250 }));
      opacity.set(withTiming(1, { duration: 250 }));

      // Auto-dismiss
      timerRef.current = setTimeout(hide, duration);
    } else {
      hide();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // react-doctor-disable-next-line react-doctor/exhaustive-deps — translateY.set/opacity.set are stable Reanimated methods; hide is Compiler-memoized
  }, [visible, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        isError ? styles.error : styles.success,
        animatedStyle,
      ]}
      pointerEvents={visible ? "auto" : "none"}
    >
      <Pressable onPress={hide} style={styles.touchable}>
        <Text style={styles.text} numberOfLines={2}>
          {message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    left: 24,
    right: 24,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    zIndex: 9999,
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  },
  success: {
    backgroundColor: "#1C1C1E",
  },
  error: {
    backgroundColor: "#DC2626",
  },
  touchable: {
    width: "100%",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
});
