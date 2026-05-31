import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Profile2Content } from "@/features/auth/components/Profile2Content";
import { useRegisterStore } from "@/store/registerStore";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function Profile2() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const about = useRegisterStore((state) => state.about);
  const especialidades = useRegisterStore((state) => state.especialidades);
  const setAbout = useRegisterStore((state) => state.setAbout);
  const setEspecialidades = useRegisterStore(
    (state) => state.setEspecialidades,
  );

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
    router.push("/(onboarding)/profile-3");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
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
