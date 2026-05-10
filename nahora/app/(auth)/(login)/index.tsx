import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Screen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>app/(auth)/(login)/index.tsx</Text>
      <Button
        title="Go to Home"
        onPress={() => router.push("/(client)/(home)")}
      />
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
    marginBottom: 20,
  },
});
