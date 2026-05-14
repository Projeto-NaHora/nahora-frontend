import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const STEPS = [
  { number: 1, label: "Info Básica" },
  { number: 2, label: "Especialidades" },
  { number: 3, label: "Portfólio" },
];

type StepStatus = "completed" | "active" | "pending";

type ProfileStepIndicatorProps = {
  currentStep: number;
};

function getStepStatus(stepNumber: number, currentStep: number): StepStatus {
  if (stepNumber < currentStep) return "completed";
  if (stepNumber === currentStep) return "active";
  return "pending";
}

export function ProfileStepIndicator({
  currentStep,
}: ProfileStepIndicatorProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const status = getStepStatus(step.number, currentStep);

        const circleStyle = [
          styles.circle,
          status === "active" && {
            backgroundColor: colors.brand,
            borderColor: colors.brand,
          },
          status === "completed" && {
            backgroundColor: colors.brand,
            borderColor: colors.brand,
          },
          status === "pending" && {
            backgroundColor: "transparent",
            borderColor: colors.border,
          },
        ];

        const stepNumberStyle = [
          styles.stepNumber,
          (status === "active" || status === "completed") && {
            color: colors.onBrand,
          },
          status === "pending" && { color: colors.textSecondary },
        ];

        const labelStyle = [
          styles.label,
          (status === "active" || status === "completed") && {
            color: colors.textPrimary,
          },
          status === "pending" && { color: colors.textSecondary },
        ];

        const connectorStyle = [
          styles.connector,
          status === "completed" && { backgroundColor: colors.brand },
          status !== "completed" && { backgroundColor: colors.border },
        ];

        return (
          <React.Fragment key={step.number}>
            <View style={styles.stepItem}>
              {/* Circle */}
              <View style={circleStyle}>
                {status === "completed" ? (
                  <Text style={[styles.checkMark, { color: colors.onBrand }]}>
                    ✓
                  </Text>
                ) : (
                  <Text style={stepNumberStyle}>{step.number}</Text>
                )}
              </View>
              {/* Label */}
              <Text style={labelStyle}>{step.label}</Text>
            </View>
            {/* Connector line */}
            {index < STEPS.length - 1 && <View style={connectorStyle} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 36,
  },
  stepItem: {
    alignItems: "center",
    gap: 8,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  checkMark: {
    fontSize: 16,
    fontWeight: "700",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "700",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  connector: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
    marginBottom: 32,
  },
});
