// components/ui/Snackbar.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, TouchableOpacity } from "react-native";

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
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  useEffect(() => {
    if (visible) {
      // Show
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      timerRef.current = setTimeout(() => {
        hide();
      }, duration);
    } else {
      hide();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [visible, hide, duration]);

  return (
    <Animated.View
      style={[
        styles.container,
        isError ? styles.error : styles.success,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      pointerEvents={visible ? "auto" : "none"}
    >
      <TouchableOpacity onPress={hide} style={styles.touchable}>
        <Text style={styles.text} numberOfLines={2}>
          {message}
        </Text>
      </TouchableOpacity>
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
