import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Profile2Content } from "@/features/auth/components/Profile2Content";
import { useEditProfileForm } from "@/features/profile/hooks/useEditProfileForm";
import { Colors } from "@/constants/theme";

export default function PublicProfile2() {
  const router = useRouter();
  const theme = "light";
  const colors = Colors[theme];

  const { about, especialidades, setAbout, setEspecialidades } =
    useEditProfileForm();

  const handleAddTag = (tag: string) => {
    if (!especialidades.includes(tag)) {
      setEspecialidades([...especialidades, tag]);
    }
  };

  const handleRemoveTag = (index: number) => {
    setEspecialidades(especialidades.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    router.push("/(professional)/(account)/public-profile-3");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "#ffffff" }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Profile2Content
            about={about}
            especialidades={especialidades}
            onChangeAbout={setAbout}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onBack={handleBack}
            onContinue={handleContinue}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
