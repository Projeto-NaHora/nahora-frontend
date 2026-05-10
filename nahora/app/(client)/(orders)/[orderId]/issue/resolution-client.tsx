import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Resolutionclient() {
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        app/(client)/(orders)/[orderId]/issue/resolution-client.tsx
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
