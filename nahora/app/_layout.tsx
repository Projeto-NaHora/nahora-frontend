import { useEffect, useState } from "react";
import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { SWRConfig } from "swr";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "@/store/authStore";
import type { ProfessionalOnboarding } from "@/store/authStore";

const ONBOARDING_ROUTE: Record<ProfessionalOnboarding, string> = {
  identidade: "/(auth)/(register)/professional/profession",
  aguardando: "/(auth)/(register)/professional/validation",
  perfil: "/(auth)/(register)/professional/profile-1",
};

export default function RootLayout() {
  const { user, accessToken, restoreSession, professionalOnboarding } =
    useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    restoreSession().finally(() => setRestoring(false));
  }, []);

  useEffect(() => {
    if (restoring) return;
    // Wait until the navigator is fully mounted
    if (!navigationState?.key) return;
    if (!segments[0]) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inClientGroup = segments[0] === "(client)";
    const inProfGroup = segments[0] === "(professional)";

    if (!user || !accessToken) {
      if (!inAuthGroup) {
        router.replace("/(auth)/(login)");
      }
    } else if (user.tipo === "CLIENTE") {
      if (!inClientGroup) {
        router.replace("/(client)/(home)");
      }
    } else if (user.tipo === "PROFISSIONAL") {
      if (professionalOnboarding !== null) {
        // Professional hasn't finished registration — keep in (auth) group.
        if (!inAuthGroup) {
          router.replace(ONBOARDING_ROUTE[professionalOnboarding] as any);
        }
      } else if (!inProfGroup) {
        router.replace("/(professional)/(home)");
      }
    }
  }, [
    user,
    accessToken,
    segments,
    router,
    navigationState?.key,
    restoring,
    professionalOnboarding,
  ]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SWRConfig
        value={{
          dedupingInterval: 30_000,
          errorRetryInterval: 5000,
          revalidateOnFocus: true,
        }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(client)" />
          <Stack.Screen name="(professional)" />
        </Stack>
      </SWRConfig>
    </GestureHandlerRootView>
  );
}
