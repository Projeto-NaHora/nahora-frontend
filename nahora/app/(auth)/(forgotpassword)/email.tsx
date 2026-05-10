import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Email() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {" "}
        app / (auth) / (forgotpassword) / email.tsx
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
