import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PropostasListContent from "@/features/proposals/components/PropostasListContent";

export default function PropostasScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }} edges={[]}>
      <PropostasListContent />
    </SafeAreaView>
  );
}
