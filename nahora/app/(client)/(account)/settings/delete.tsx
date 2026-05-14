import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Delete() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        app/(client)/(account)/settings/delete.tsx
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
  },
});
