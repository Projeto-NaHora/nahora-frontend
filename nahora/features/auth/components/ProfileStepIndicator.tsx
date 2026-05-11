import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const status = getStepStatus(step.number, currentStep);

        return (
          <React.Fragment key={step.number}>
            <View style={styles.stepItem}>
              {/* Circle */}
              <View
                style={[
                  styles.circle,
                  status === "active" && styles.circleActive,
                  status === "completed" && styles.circleCompleted,
                  status === "pending" && styles.circlePending,
                ]}
              >
                {status === "completed" ? (
                  <Text style={styles.checkMark}>✓</Text>
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      status === "active" && styles.stepNumberActive,
                      status === "pending" && styles.stepNumberPending,
                    ]}
                  >
                    {step.number}
                  </Text>
                )}
              </View>
              {/* Label */}
              <Text
                style={[
                  styles.label,
                  (status === "active" || status === "completed") &&
                    styles.labelActive,
                  status === "pending" && styles.labelPending,
                ]}
              >
                {step.label}
              </Text>
            </View>
            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <View
                style={[
                  styles.connector,
                  status === "completed" && styles.connectorActive,
                ]}
              />
            )}
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
  },
  circleActive: {
    backgroundColor: "#f27a24",
    borderWidth: 2,
    borderColor: "#f27a24",
  },
  circleCompleted: {
    backgroundColor: "#f27a24",
    borderWidth: 2,
    borderColor: "#f27a24",
  },
  circlePending: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  checkMark: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "700",
  },
  stepNumberActive: {
    color: "#ffffff",
  },
  stepNumberPending: {
    color: "#6b7280",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  labelActive: {
    color: "#1f2937",
  },
  labelPending: {
    color: "#6b7280",
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 4,
    marginBottom: 32,
  },
  connectorActive: {
    backgroundColor: "#f27a24",
  },
});
