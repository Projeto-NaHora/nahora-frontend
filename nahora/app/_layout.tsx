import { useEffect, useRef } from "react";
import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { SWRConfig } from "swr";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "@/store/authStore";
import type { ProfessionalOnboarding } from "@/store/authStore";

const ONBOARDING_ROUTE: Record<ProfessionalOnboarding, string> = {
  identidade: "/(auth)/(register)/professional/profession",
  aguardando: "/(onboarding)/validation",
  perfil: "/(onboarding)/profile-1",
  cadastro_incompleto: "/(auth)/(register)/professional/profession",
  rejeitado: "/(auth)/(register)/professional/rejected",
};

export default function RootLayout() {
  const { user, accessToken, restoreSession, professionalOnboarding } =
    useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const restoringRef = useRef(true);

  useEffect(() => {
    restoreSession().finally(() => { restoringRef.current = false; });
  }, [restoreSession]);

  useEffect(() => {
    if (restoringRef.current) return;
    if (!navigationState?.key) return;
    if (!segments[0]) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inClientGroup = segments[0] === "(client)";
    const inProfGroup = segments[0] === "(professional)";

    console.log("[AuthGuard]", {
      user: user?.tipo ?? null,
      accessToken: !!accessToken,
      segments: segments[0],
      professionalOnboarding,
    });

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
        // Only redirect if the current route group doesn't match the
        // target group — this lets users navigate forward within the
        // (onboarding) group without being bounced back to page 1.
        const targetRoute = ONBOARDING_ROUTE[professionalOnboarding];
        const targetGroup = targetRoute.split("/")[1];
        const currentGroup = segments[0];
        console.log("[AuthGuard:onboarding]", {
          targetRoute,
          targetGroup,
          currentGroup,
          match: currentGroup === targetGroup,
          action:
            currentGroup === targetGroup
              ? "skip (already in group)"
              : "redirect",
        });
        if (currentGroup !== targetGroup) {
          router.replace(targetRoute as any);
        }
      } else if (!inProfGroup) {
        router.replace("/(professional)/(home)");
      }
    } else {
      console.warn("[AuthGuard] tipo desconhecido:", user.tipo);
    }
  }, [
    user,
    accessToken,
    segments,
    router,
    navigationState?.key,
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
          <Stack.Screen name="(onboarding)" />
        </Stack>
      </SWRConfig>
    </GestureHandlerRootView>
  );
}
